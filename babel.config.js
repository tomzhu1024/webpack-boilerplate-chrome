/* eslint-env node */
const env = require('./utils/env');

const isDevelopment = env.NODE_ENV === 'development';

module.exports = {
  presets: [
    ['@babel/preset-env', { useBuiltIns: 'usage', corejs: '3' }],
    ['@babel/preset-react', { development: isDevelopment, runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    '@babel/plugin-transform-runtime',
    isDevelopment && require.resolve('react-refresh/babel'),
  ].filter(Boolean),
};
