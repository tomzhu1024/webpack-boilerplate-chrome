/* eslint-env node */
// Tiny wrapper with default env vars
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  ANALYZER: process.env.ANALYZER || 'false',
};
