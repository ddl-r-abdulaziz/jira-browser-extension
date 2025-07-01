// Simple browser API polyfill for cross-browser compatibility
(function() {
  'use strict';

  // Create a unified browser API object
  if (typeof browser === 'undefined' && typeof chrome !== 'undefined') {
    // Chrome/Chromium - create browser API from chrome API
    window.browser = {
      storage: {
        sync: {
          get: (keys) => new Promise((resolve) => {
            chrome.storage.sync.get(keys, resolve);
          }),
          set: (items) => new Promise((resolve) => {
            chrome.storage.sync.set(items, resolve);
          })
        }
      },
      runtime: {
        onMessage: {
          addListener: chrome.runtime.onMessage.addListener.bind(chrome.runtime.onMessage)
        },
        sendMessage: (message, callback) => {
          chrome.runtime.sendMessage(message, callback);
        },
        lastError: chrome.runtime.lastError
      },
      tabs: {
        query: (queryInfo) => new Promise((resolve) => {
          chrome.tabs.query(queryInfo, resolve);
        }),
        sendMessage: (tabId, message, callback) => {
          chrome.tabs.sendMessage(tabId, message, callback);
        }
      },
      action: chrome.action || chrome.browserAction
    };
  } else if (typeof chrome === 'undefined' && typeof browser !== 'undefined') {
    // Firefox/Floorp - browser API is already available, but add chrome alias
    window.chrome = {
      storage: browser.storage,
      runtime: browser.runtime,
      tabs: browser.tabs,
      action: browser.browserAction
    };
  }
})();