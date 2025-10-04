'use strict';

import './popup.css';
import { t, updatePageTexts } from './i18n.js';

(function() {
  // Function to get all videos from the current active tab
  async function getVideosFromCurrentTab() {
    try {
      // Query the active tab in the current window
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send a message to the content script to get video information
      const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_VIDEOS' });
      
      return response.videos || [];
    } catch (error) {
      console.error('Error getting videos from current tab:', error);
      // Check if it's a connection error (content script not loaded)
      if (error.message && error.message.includes('Could not establish connection')) {
        // Show an appropriate message to the user
        const videoListContainer = document.getElementById('video-list');
        if (videoListContainer) {
          videoListContainer.innerHTML = `<p class="no-videos">${t('contentScriptNotLoaded')}</p>`;
        }
      }
      return [];
    }
  }

  // Function to render video list in popup
  function renderVideoList(videos) {
    const videoListContainer = document.getElementById('video-list');
    
    if (videos.length === 0) {
      videoListContainer.innerHTML = `<p class="no-videos">${t('noVideosFound')}</p>`;
      return;
    }

    // Clear the container
    videoListContainer.innerHTML = '';

    // Create a container for each video
    videos.forEach(video => {
      const videoItem = document.createElement('div');
      videoItem.className = 'video-item';
      
      // Create thumbnail placeholder (using a generic video icon)
      const thumbnail = document.createElement('div');
      thumbnail.className = 'video-thumbnail';
      thumbnail.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 7L12 12L6 7V17L12 12L18 17V7Z" stroke="gray" stroke-width="2" fill="none"/>
        </svg>
      `;
      
      // Create info container
      const infoContainer = document.createElement('div');
      infoContainer.className = 'video-info';
      
      // Video title (using src as title if no title available)
      const title = document.createElement('p');
      title.className = 'video-title';
      title.textContent = video.title || video.src || t('unknownVideo');
      
      // Video source URL
      const src = document.createElement('p');
      src.className = 'video-src';
      src.textContent = video.src ? truncateUrl(video.src) : t('noSource');
      
      // Create open miniplayer button
      const openBtn = document.createElement('button');
      openBtn.className = 'open-miniplayer-btn';
      if (video.isInPictureInPicture) {
        openBtn.classList.add('active');
      }
      openBtn.title = t('openMiniplayer');
      openBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="10" height="8" rx="1" ry="1" stroke="white" stroke-width="1.2"/>
          <rect x="6" y="6" width="8" height="6" rx="1" ry="1" fill="white" stroke="white" stroke-width="1.2"/>
        </svg>
      `;
      // 设置按钮的title属性用于国际化
      openBtn.setAttribute('data-i18n-attr', `openMiniplayer|title`);
      openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openMiniplayerForVideo(video);
      });
      
      // Assemble the elements
      infoContainer.appendChild(title);
      infoContainer.appendChild(src);
      
      videoItem.appendChild(thumbnail);
      videoItem.appendChild(infoContainer);
      videoItem.appendChild(openBtn);
      
      // Add click event to open miniplayer
      videoItem.addEventListener('click', () => {
        openMiniplayerForVideo(video);
      });
      
      videoListContainer.appendChild(videoItem);
    });
  }

  // Helper function to truncate URL for display
  function truncateUrl(url) {
    if (url.length <= 40) return url;
    return url.substring(0, 37) + '...';
  }

  // Function to open miniplayer for a specific video
 async function openMiniplayerForVideo(video) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send a message to the content script to activate miniplayer for this video
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'OPEN_MINIPLAYER',
        videoSrc: video.src
      });
      
      // Close the popup after opening the miniplayer
      window.close();
    } catch (error) {
      console.error('Error opening miniplayer:', error);
      // Check if it's a connection error (content script not loaded)
      if (error.message && error.message.includes('Could not establish connection')) {
        alert(t('contentScriptNotLoaded'));
      } else {
        alert(t('openMiniplayerError'));
      }
    }
  }

  // Initialize the popup
  async function init() {
    // Update all texts based on locale
    updatePageTexts();
    
    // Show loading state
    const videoListContainer = document.getElementById('video-list');
    videoListContainer.innerHTML = `<p>${t('searchingVideos')}</p>`;
    
    // Get videos from the current page
    const videos = await getVideosFromCurrentTab();
    
    // Render the video list
    renderVideoList(videos);
  }

  // Start the initialization when the popup loads
  document.addEventListener('DOMContentLoaded', init);
})();
