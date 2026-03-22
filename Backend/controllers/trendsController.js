const { searchYouTubeByTopic } = require('../services/youtubeService');
const { searchRedditByTopic } = require('../services/redditService');
const { searchTwitterByTopic } = require('../services/twitterService');
const { getOpenRouterGeneratedTrends } = require('../services/openRouterTrendsService');
const { analyzeTrendSentiment } = require('../services/aiService'); // <-- IMPORT THE NEW AI FUNCTION

const getTrends = async (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ success: false, error: 'Please provide a topic as a query parameter.' });
  }

  try {
    const [youtubeTrends, redditTrends, twitterTrends, openRouterTrends] = await Promise.all([
      searchYouTubeByTopic(topic),
      searchRedditByTopic(topic),
      searchTwitterByTopic(topic),
      getOpenRouterGeneratedTrends(topic),
    ]);

    const allTrends = [...youtubeTrends, ...redditTrends, ...twitterTrends, ...openRouterTrends];

    if (allTrends.length === 0) {
      return res.status(200).json({ success: true, count: 0, data: [], message: `Could not find any trends for the topic: "${topic}"` });
    }

    // --- NEW: Enhance trends with AI sentiment analysis ---
    const trendsWithSentiment = await analyzeTrendSentiment(allTrends);

    res.status(200).json({ success: true, count: trendsWithSentiment.length, data: trendsWithSentiment });
  } catch (error) {
    console.error('Error in getTrends controller:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getTrends,
};