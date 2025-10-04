'use strict';

// Background script for handling messages and extension events
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    // Send a response message
    sendResponse({
      message: 'Background script received the message',
    });
 }
});
