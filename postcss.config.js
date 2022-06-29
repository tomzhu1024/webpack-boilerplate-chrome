/* eslint-env node */
const tailwindcss = require('tailwindcss');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const env = require('./utils/env');

const isDevelopment = env.NODE_ENV === 'development';

module.exports = {
  plugins: [tailwindcss, postcssPresetEnv, !isDevelopment && cssnano].filter(Boolean),
};
