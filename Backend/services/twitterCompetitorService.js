const cache = require('./cacheService');
const { getTweetDate, getTweetId, getTweetText, getUserInfo, getUserTweets } = require('./getxapiService');

/**
 * Fetches the latest tweets from a specific Twitter user.
 * @param {string} username - The Twitter username (without @).
 * @returns {Promise<object>} - An object containing user details and recent posts.
 */
const getTweetsByUsername = async (username) => {
  const cacheKey = `twitter_competitor_${username.toLowerCase()}`;
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    console.log(`Serving competitor tweets for "${username}" from cache.`);
    return cachedData;
  }
  
  try {
    const normalizedUsername = username.replace(/^@/, '');
    const user = await getUserInfo(normalizedUsername);
    if (!user || (!user.userName && !user.username && !user.name && !user.displayName)) {
      throw new Error(`Twitter user not found: ${username}`);
    }
    const name = user.name || user.displayName || user.userName || user.username || normalizedUsername;

    const tweets = await getUserTweets(normalizedUsername);

    const recentPosts = tweets.slice(0, 10)
      .filter(tweet => getTweetId(tweet) && getTweetText(tweet))
      .map(tweet => ({
        postId: getTweetId(tweet),
        title: getTweetText(tweet),
        link: `https://twitter.com/${normalizedUsername}/status/${getTweetId(tweet)}`,
        publishedAt: new Date(getTweetDate(tweet) || Date.now()),
        format: 'Tweet',
      }));

    const result = { twitterHandle: normalizedUsername, name, recentPosts };
    await cache.set(cacheKey, result);
    return result;

  } catch (error) {
    const errorMessage = error.data ? `${error.data.title}: ${error.data.detail}` : error.message;
    console.error(`Error fetching tweets for user "${username}":`, errorMessage);
    throw new Error('Could not fetch Twitter user data.');
  }
};

module.exports = { getTweetsByUsername };