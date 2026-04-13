const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  PORT: process.env.PORT || 3000,
  ATLAS_DB_URL: process.env.ATLAS_DB_URL,
  LOG_DB_URL: process.env.LOG_DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  // AI / LangChain settings
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  OPENAI_TEMPERATURE: process.env.OPENAI_TEMPERATURE || '0.7',
};
