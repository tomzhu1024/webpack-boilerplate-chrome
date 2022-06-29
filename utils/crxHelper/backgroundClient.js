/* eslint-env node */
/* global __resourceQuery */
const options = {
  protocol: 'http',
  host: 'localhost',
  port: 3000,
  path: '/crx_helper',
};
if (__resourceQuery) {
  const querystring = require('querystring');
  const overrides = querystring.parse(__resourceQuery.slice(1));
  overrides.protocol && (options.protocol = overrides.protocol);
  overrides.host && (options.host = overrides.host);
  overrides.port && (options.port = overrides.port);
  overrides.path && (options.path = overrides.path);
}

const source = new EventSource(`${options.protocol}://${options.host}:${options.port}${options.path}`);
source.addEventListener('open', () => {
  console.log('[crx-helper] Connected to devServer.');
});
source.addEventListener('error', () => {
  console.error('[crx-helper] Failed to connect to devServer.');
});
source.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'backgroundUpdates') {
    console.log('[crx-helper] Detected Background updates, reloading extension...');
    source.close();
    chrome.runtime.reload();
  } else if (data.type === 'contentScriptUpdates') {
    console.log('[crx-helper] Detected Content Script updates, reloading pages...');
    chrome.tabs.query({ active: true }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { type: 'contentScriptUpdates' });
      });
      console.log('[crx-helper] Reloading extension...');
      source.close();
      chrome.runtime.reload();
    });
  }
});
