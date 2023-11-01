/* eslint-env node */
const env = require('./utils/env');

const isDevelopment = env.NODE_ENV === 'development';

module.exports = {
  presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
  plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
};
