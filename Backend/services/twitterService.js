const cache = require('./cacheService');
const { getTweetId, getTweetText, getUsername, searchTweets } = require('./getxapiService');

const searchTwitterByTopic = async (topic) => {
  if (!topic) return [];

  const cacheKey = `twitter_trends_${topic.toLowerCase()}`;
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    console.log(`Serving Twitter trends for "${topic}" from cache.`);
    return cachedData;
  }

  console.log(`Fetching new Twitter trends for "${topic}" from API.`);
  try {
    const tweets = await searchTweets(topic);
    const trends = tweets.slice(0, 10).filter(tweet => getTweetId(tweet) && getTweetText(tweet)).map(tweet => ({
      keyword: getTweetText(tweet),
      link: `https://twitter.com/${getUsername(tweet, 'i')}/status/${getTweetId(tweet)}`,
      platform: 'Twitter',
      industry: topic,
    }));
    
    await cache.set(cacheKey, trends);
    return trends;

  } catch (error) {
    console.error(`Error searching Twitter for topic "${topic}":`, error);
    return [];
  }
};

module.exports = { searchTwitterByTopic };