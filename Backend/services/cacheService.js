const NodeCache = require('node-cache');
const { createClient } = require('redis');

const DEFAULT_TTL_SECONDS = 21600;
const localCache = new NodeCache({ stdTTL: DEFAULT_TTL_SECONDS });
const redisUrl = process.env.REDIS_URL;
let redisClient;

if (redisUrl) {
	redisClient = createClient({
		url: redisUrl,
		socket: {
			reconnectStrategy: retries => retries > 3 ? false : Math.min(retries * 250, 1000),
		},
	});
	redisClient.on('error', error => {
		console.error('Redis cache error:', error.message);
	});

	redisClient.connect()
		.then(() => {
			console.log('Redis cache connected.');
		})
		.catch(error => {
			console.error('Redis connection failed. Using local cache:', error.message);
		});
} else {
	console.log('REDIS_URL is not set. Using local cache.');
}

const get = async (key) => {
	if (redisClient?.isReady) {
		try {
			const value = await redisClient.get(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			console.error('Redis get failed:', error.message);
		}
	}

	return localCache.get(key) || null;
};

const set = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
	localCache.set(key, value, ttlSeconds);

	if (redisClient?.isReady) {
		try {
			await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
		} catch (error) {
			console.error('Redis set failed:', error.message);
		}
	}
};

module.exports = { get, set };