import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Mail, UserPlus } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setLoading(true);
    try {
      await signup(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.normalizedMessage || 'Failed to create account.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111827] p-8 rounded-2xl shadow-2xl border border-purple-500/20 relative z-10">
        <div className="flex items-center justify-center mb-6 gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            PlanovaAI
          </span>
        </div>
        <h2 className="text-3xl font-bold text-center text-[#E5E7EB] mb-2">Create Your Account</h2>
        <p className="text-center text-[#9CA3AF] mb-6">Get started with your AI-powered content strategy.</p>
        
        {error && <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-[#E5E7EB] block mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              Email Address
            </label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#1F2937] rounded-lg text-[#E5E7EB] border border-purple-500/20 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
              required 
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#E5E7EB] block mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              Password
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#1F2937] rounded-lg text-[#E5E7EB] border border-purple-500/20 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
              required 
              minLength="6"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#E5E7EB] block mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              Confirm Password
            </label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-[#1F2937] rounded-lg text-[#E5E7EB] border border-purple-500/20 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
              required 
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-semibold py-3 rounded-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Creating account...' : (
              <>
                <UserPlus className="w-5 h-5" />
                Sign Up
              </>
            )}
          </motion.button>
        </form>
        <p className="text-center text-[#9CA3AF] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Log In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;