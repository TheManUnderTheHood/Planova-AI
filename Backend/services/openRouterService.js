const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-opus-4.6';

const stripCodeFences = (text) => {
  if (!text) return text;
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
};

const getHeaders = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set.');
  }

  return {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:5173',
    'X-Title': process.env.OPENROUTER_APP_NAME || 'Planova AI',
  };
};

const generateText = async (prompt, options = {}) => {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.5,
    maxTokens = 3000,
  } = options;

  const response = await axios.post(
    OPENROUTER_URL,
    {
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    },
    { headers: getHeaders() }
  );

  return response.data?.choices?.[0]?.message?.content?.trim() || '';
};

const generateJson = async (prompt, options = {}) => {
  const text = await generateText(prompt, options);
  return JSON.parse(stripCodeFences(text));
};

module.exports = {
  generateText,
  generateJson,
};