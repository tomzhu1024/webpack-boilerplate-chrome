# Auto-Reload

## Why It Exists

In Chrome extension development, some entries _does not_ support [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/). Two typical examples are the Content Scripts (which lack the permission to establish a connection with the Dev Server to receive new changes) and the Background script (which is now a service worker under manifest v3 and has no global `document` node that the Hot Module Replacement requires to work).

## How It Works

One possible solution to achieve a similar effect is to inject clients in _Background_ and _Content Scripts_ and set-up a custom middleware in the Dev Server. At the beginning, the client in _Background_ script establishes a long connection with the Dev Server.

When the Dev Server announces a code change in the Background:

- The client in _Background_ reloads the extension with `chrome.runtime.reload()`;

When the development server announces a code change in the content script:

- The client in _Background_ uses `chrome.runtime.sendMessage()` to communicate with the client in _Content Script_;
- Upon receiving the message, the client in _Content Script_ reloads the page;
- The client in _Background_ reloads the extension with `chrome.runtime.reload()`;

This approach allows new changes in the code to be applied immediately and eliminates the hassle of manually reloading the extension and pages. However, unlike [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/), which preserves the _states_ of the code, **this approach will inevitably lose all the _states_ of the code, which may be undesirable in some cases**.

## How To Use It

For _Background_ and _Content Scripts_, please add their entries in the `NOT_HOT_RELOAD` field in `utils/env.js` to exclude them from [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/). It is optional to configure `CONTENT_SCRIPT` and `BACKGROUND` to match the entries of _Content Scripts_ and _Background_ respectively. Configure them when you wish to enable _Auto-Reload_.

Notice that the service worker in _Background_ will be inactive automatically after a period of time, which will cause _Auto-Reload_ to be non-functional. One possible solution to fix this issue is to keep the DevTool panel of the _Background_ service worker open during the development (See #1 for more details).
