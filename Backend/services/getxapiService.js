const axios = require('axios');

const GETXAPI_URL = 'https://api.getxapi.com';

const getClient = () => {
  if (!process.env.GETXAPI_KEY) {
    throw new Error('GETXAPI_KEY is not set.');
  }

  return axios.create({
    baseURL: GETXAPI_URL,
    timeout: 15000,
    headers: {
      Authorization: `Bearer ${process.env.GETXAPI_KEY}`,
      Accept: 'application/json',
    },
  });
};

const getRecords = payload => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.tweets)) return payload.tweets;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.tweets)) return payload.data.tweets;
  if (Array.isArray(payload?.data?.results)) return payload.data.results;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
};

const getRecord = payload => payload?.data?.user || payload?.data?.profile || payload?.user || payload?.profile || payload?.data || payload;

const getTweetText = tweet => tweet?.text || tweet?.full_text || tweet?.content || '';
const getTweetId = tweet => tweet?.id || tweet?.tweetId || tweet?.tweet_id;
const getTweetDate = tweet => tweet?.created_at || tweet?.createdAt || tweet?.date || tweet?.published_at;
const getUsername = (tweet, fallback) => tweet?.author?.userName || tweet?.author?.username || tweet?.user?.userName || tweet?.user?.username || tweet?.userName || tweet?.username || fallback;

const searchTweets = async topic => {
  const response = await getClient().get('/twitter/tweet/advanced_search', {
    params: { q: `${topic} -is:retweet lang:en`, product: 'Latest' },
  });
  return getRecords(response.data);
};

const getUserInfo = async username => {
  const response = await getClient().get('/twitter/user/info', {
    params: { userName: username.replace(/^@/, '') },
  });
  return getRecord(response.data);
};

const getUserTweets = async username => {
  const response = await getClient().get('/twitter/user/tweets', {
    params: { userName: username.replace(/^@/, '') },
  });
  return getRecords(response.data);
};

module.exports = {
  getTweetDate,
  getTweetId,
  getTweetText,
  getUsername,
  getUserInfo,
  getUserTweets,
  searchTweets,
};