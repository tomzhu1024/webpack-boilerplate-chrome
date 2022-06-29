/* eslint-env node */
// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const env = require('./env');
const config = require('../webpack.config');

const entriesNotToHotReload = env.NOT_HOT_RELOAD || [];
const entriesOfContentScripts = env.CONTENT_SCRIPT || [];
const entriesOfBackground = env.BACKGROUND || [];

for (let entryName in config.entry) {
  // Inject HMR modules
  if (!entriesNotToHotReload.includes(entryName)) {
    config.entry[entryName] = [
      'webpack/hot/dev-server',
      `webpack-dev-server/client?hostname=${env.HOST}&port=${env.PORT}&hot=true&live-reload=true`,
      '@pmmmwh/react-refresh-webpack-plugin/client/ReactRefreshEntry',
      `@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry?sockHost=${env.HOST}&sockPort=${env.PORT}`,
    ].concat(config.entry[entryName]);
  }
  // Inject Content Script client
  if (entriesOfContentScripts.includes(entryName)) {
    config.entry[entryName] = [path.resolve(__dirname, 'crxHelper/contentScriptClient.js')].concat(
      config.entry[entryName]
    );
  }
  // Inject Background client
  if (entriesOfBackground.includes(entryName)) {
    config.entry[entryName] = [
      path.resolve(__dirname, `crxHelper/backgroundClient.js?host=${env.HOST}&port=${env.PORT}`),
    ].concat(config.entry[entryName]);
  }
}

const compiler = webpack(config);
const server = new WebpackDevServer(
  {
    hot: false,
    client: false,
    static: path.resolve(__dirname, '../build'),
    host: env.HOST,
    port: env.PORT,
    devMiddleware: {
      writeToDisk: true,
    },
    setupMiddlewares: (middlewares, devServer) => {
      middlewares.push({
        name: 'crx-helper',
        path: '/crx_helper',
        middleware: (req, res) => {
          // SSE implementation from https://stackoverflow.com/a/59041709.
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Connection', 'keep-alive');
          res.flushHeaders(); // flush the headers to establish SSE with client

          let closed = false;
          devServer.compiler.hooks.done.tap('crx-helper', (stats) => {
            if (closed) {
              return;
            }
            const compiledNames = stats
              .toJson({ all: false, modules: true })
              .modules.filter((i) => i.name !== undefined)
              .map((i) => i.name);
            const compiledChunks = stats
              .toJson()
              .modules.filter((i) => compiledNames.includes(i.name))
              .map((i) => i.chunks)
              .reduce((previousValue, currentValue) => previousValue.concat(currentValue), []);
            const isContentScriptsUpdated =
              !stats.hasErrors() && compiledChunks.some((chunk) => entriesOfContentScripts.includes(chunk));
            const isBackgroundUpdated =
              !stats.hasErrors() && compiledChunks.some((chunk) => entriesOfBackground.includes(chunk));
            let data;
            if (isContentScriptsUpdated) {
              data = { type: 'contentScriptUpdates' };
            } else if (isBackgroundUpdated) {
              data = { type: 'backgroundUpdates' };
            }
            if (data) {
              res.write(`data: ${JSON.stringify(data)}\n\n`); // res.write() instead of res.send()
              // Call `res.flush()` to actually write the data to the client.
              // See https://github.com/expressjs/compression#server-sent-events for details.
              res.flush();
            }
          });
          res.on('close', () => {
            closed = true;
            res.end();
          });
        },
      });
      return middlewares;
    },
  },
  compiler
);
server.start();
