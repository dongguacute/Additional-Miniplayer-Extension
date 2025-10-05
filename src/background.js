'use strict';

// Browser API polyfill for cross-browser compatibility
const browserAPI = globalThis.browser || globalThis.chrome;

// Background script for handling messages and extension events
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    // Send a response message
    sendResponse({
      message: 'Background script received the message',
    });
  }
  // For other message types, we let content scripts handle them directly
  // Return true to indicate we want to send a response asynchronously
 return true;
});
