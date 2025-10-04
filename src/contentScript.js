'use strict';

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_VIDEOS') {
        // Get all valid videos on the page and return their info
        const videos = Array.from(document.querySelectorAll('video'))
            .filter(video => isValidVideoForMiniplayer(video))
            .map(video => {
                return {
                    src: video.currentSrc || video.src || '',
                    title: getVideoTitle(video),
                    duration: video.duration || 0,
                    currentTime: video.currentTime || 0,
                    paused: video.paused,
                    isInPictureInPicture: document.pictureInPictureElement === video
                };
            });

        sendResponse({ videos });
    } else if (request.type === 'OPEN_MINIPLAYER') {
        // Find the video with the given src and activate Picture-in-Picture
        const video = Array.from(document.querySelectorAll('video')).find(v =>
            v.currentSrc === request.videoSrc || v.src === request.videoSrc
        );
        
        if (video) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else if (video.requestPictureInPicture) {
                video.requestPictureInPicture()
                    .then(() => console.log('Picture-in-Picture activated'))
                    .catch(err => console.error('Error with Picture-in-Picture:', err));
            }
        }
        
        sendResponse({ success: true });
    }
    
    // Return true to indicate we want to send a response asynchronously
    return true;
});

// Ensure content script is properly initialized by sending a status message to console
console.log('Additional Miniplayer content script loaded and ready to receive messages.');

// Function to get a title for the video (try different strategies)
function getVideoTitle(video) {
    // Try to get title from surrounding context
    const titleElement = video.closest('h1, h2, h3') ||
                         video.parentElement.querySelector('h1, h2, h3') ||
                         video.closest('[title]') ||
                         video.parentElement.querySelector('[title]');
    
    if (titleElement) {
        return titleElement.title || titleElement.textContent.trim();
    }
    
    // If no title found, try to extract from src
    const src = video.currentSrc || video.src;
    if (src) {
        const pathParts = src.split('/');
        const filename = pathParts[pathParts.length - 1];
        if (filename) {
            return decodeURIComponent(filename);
        }
    }
    
    // Default title
    return '视频';
}

// Function to update miniplayer button state
function updateMiniplayerButtonState(button, video) {
    if (document.pictureInPictureElement === video) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
}

// Function to create a miniplayer button for a specific video element
function createMiniplayerButtonForVideo(video) {
    // Check if button already exists for this video
    if (video.miniplayerButton) return;

    const button = document.createElement('button');
    button.className = 'miniplayer-btn';
    button.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="10" height="8" rx="1" ry="1" fill="white" stroke-width="1.2"/>
        <rect x="6" y="6" width="8" height="6" rx="1" ry="1" fill="white" stroke="white" stroke-width="1.2"/>
    </svg>`; // Miniplayer icon with overlapping rectangles

    // Add click event
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else if (video.requestPictureInPicture) {
            video.requestPictureInPicture().catch(console.error);
        }
    });

    // Store reference to button on video element
    video.miniplayerButton = button;

    // Add to body
    document.body.appendChild(button);

    // Position the button near the video
    updateButtonPositionForVideo(video);

    // Initial state update
    updateMiniplayerButtonState(button, video);
}

// Function to remove miniplayer button for a specific video element
function removeMiniplayerButtonForVideo(video) {
    if (video.miniplayerButton) {
        video.miniplayerButton.remove();
        video.miniplayerButton = null;
    }
}

// Function to update button position for a specific video
function updateButtonPositionForVideo(video) {
    if (!video.miniplayerButton || video.miniplayerButton.style.display === 'none') return;
    
    let container = video.closest('#movie_player') || video.closest('#player') || video.closest('.html5-video-player') || video.parentNode;
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
        video.miniplayerButton.style.left = (rect.left + 5) + 'px';
        video.miniplayerButton.style.top = (rect.top + 5) + 'px';
    }
}

// Function to check if a video element is valid for miniplayer
function isValidVideoForMiniplayer(video) {
    // Must have a source
    if (!video.currentSrc && !video.src) {
        return false;
    }

    // Must not be hidden
    const style = window.getComputedStyle(video);
    if (style.display === 'none' || style.visibility === 'hidden') {
        return false;
    }

    return true;
}

// Function to check if a video element should show miniplayer button
function shouldShowMiniplayerButton(video) {
    // Must pass basic validation
    if (!isValidVideoForMiniplayer(video)) {
        return false;
    }

    // Must have some dimensions (but allow very small videos that might be loading)
    if (video.offsetWidth === 0 && video.offsetHeight === 0) {
        return false;
    }

    // Allow videos that are loading or have content
    return true;
}

// Function to update button visibility based on video presence
function updateButtonVisibility() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        if (shouldShowMiniplayerButton(video)) {
            if (!video.miniplayerButton) {
                createMiniplayerButtonForVideo(video);
            }
            if (video.miniplayerButton) {
                video.miniplayerButton.style.display = 'flex';
                updateButtonPositionForVideo(video);
            }
        } else {
            if (video.miniplayerButton) {
                video.miniplayerButton.style.display = 'none';
            }
        }
    });
}

// Function to process videos (for initial setup and dynamic content)
function processVideos() {
    updateButtonVisibility();
}

// Initial processing
processVideos();

// Delayed processing for dynamic content
setTimeout(processVideos, 2000);
setTimeout(processVideos, 5000);

// Observe for changes in the DOM
const observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'VIDEO' || node.querySelectorAll('video').length > 0) {
                    shouldUpdate = true;
                }
            }
        });
        mutation.removedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'VIDEO' || node.querySelectorAll('video').length > 0) {
                    // Remove button for removed videos
                    if (node.tagName === 'VIDEO') {
                        removeMiniplayerButtonForVideo(node);
                    } else {
                        node.querySelectorAll('video').forEach(video => {
                            removeMiniplayerButtonForVideo(video);
                        });
                    }
                    shouldUpdate = true;
                }
            }
        });
    });
    if (shouldUpdate) {
        processVideos();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Update position on scroll and resize
window.addEventListener('scroll', processVideos);
window.addEventListener('resize', processVideos);

// Update position every 0.1 seconds to handle dynamic changes like dragging
setInterval(() => {
    document.querySelectorAll('video').forEach(video => {
        if (video.miniplayerButton && video.miniplayerButton.style.display !== 'none') {
            updateButtonPositionForVideo(video);
        }
    });
}, 100);

// Listen for Picture-in-Picture state changes to update button states
document.addEventListener('enterpictureinpicture', (event) => {
    document.querySelectorAll('video').forEach(video => {
        if (video.miniplayerButton) {
            updateMiniplayerButtonState(video.miniplayerButton, video);
        }
    });
});

document.addEventListener('leavepictureinpicture', (event) => {
    document.querySelectorAll('video').forEach(video => {
        if (video.miniplayerButton) {
            updateMiniplayerButtonState(video.miniplayerButton, video);
        }
    });
});