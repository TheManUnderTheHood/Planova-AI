const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  // Basic validation
  if (!email || !password || password.length < 6 || password.length > 128) {
    return res.status(400).json({ success: false, error: 'Please provide an email and password' });
  }

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create a new User instance
    const newUser = new User({
      email: email,
      password: hashedPassword,
    });

    // 4. Save the new user to the database
    const savedUser = await newUser.save();

    // 5. Send the token response
    sendTokenResponse(savedUser, 201, res);

  } catch (error) {
    console.error('REGISTRATION CRASH:', error); // Log the full error for debugging
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide an email and password' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('LOGIN CRASH:', error); 
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
};

const googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential || !process.env.GOOGLE_CLIENT_ID) {
    return res.status(400).json({ success: false, error: 'Google sign-in is not configured.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || !payload.email_verified) {
      return res.status(401).json({ success: false, error: 'Google account could not be verified.' });
    }

    const email = payload.email.trim().toLowerCase();
    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = payload.sub;
        await user.save();
      }
    } else {
      user = await User.create({ email, googleId: payload.sub });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('GOOGLE LOGIN ERROR:', error.message);
    res.status(401).json({ success: false, error: 'Google sign-in failed.' });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const userData = {
    _id: user._id,
    email: user.email,
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData,
  });
};

module.exports = { register, login, googleLogin };