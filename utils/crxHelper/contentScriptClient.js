chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'contentScriptUpdates') {
    console.log('[crx-helper] Detected content script updates, reloading pages...');
    // Wait until extension is reloaded
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
});
console.log('[crx-helper] Started to listen for content script updates.');
