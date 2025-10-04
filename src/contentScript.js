'use strict';

let miniplayerButton = null;


// Function to create the miniplayer button if it doesn't exist
function createMiniplayerButton() {
    if (miniplayerButton) return;
    miniplayerButton = document.createElement('button');
    miniplayerButton.className = 'miniplayer-btn';
    miniplayerButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="10" height="8" rx="1" ry="1" fill="white" stroke="white" stroke-width="1.2"/>
        <rect x="6" y="6" width="8" height="6" rx="1" ry="1" fill="white" stroke="white" stroke-width="1.2"/>
    </svg>`; // Miniplayer icon with overlapping rectangles
    miniplayerButton.className = 'miniplayer-btn'; // Use CSS class instead of inline styles

    // Add click event
    miniplayerButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const video = document.querySelector('video');
        if (video) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else if (video.requestPictureInPicture) {
                video.requestPictureInPicture().catch(console.error);
            }
        }
    });

    // Add to body
    document.body.appendChild(miniplayerButton);
}

// Function to update button position
function updateButtonPosition() {
    if (miniplayerButton.style.display === 'none') return;
    const video = document.querySelector('video');
    if (video) {
        let container = video.closest('#movie_player') || video.closest('#player') || video.closest('.html5-video-player') || video.parentNode;
        const rect = container.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            miniplayerButton.style.left = (rect.left + 5) + 'px';
            miniplayerButton.style.top = (rect.top + 5) + 'px';
        }
    }
}

// Function to update button visibility based on video presence
function updateButtonVisibility() {
    const videos = document.querySelectorAll('video');
    if (videos.length > 0) {
        miniplayerButton.style.display = 'flex';
        updateButtonPosition();
    } else {
        miniplayerButton.style.display = 'none';
    }
}

// Function to process videos (for initial setup and dynamic content)
function processVideos() {
    createMiniplayerButton();
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
                    shouldUpdate = true;
                }
            }
        });
    });
    if (shouldUpdate) {
        updateButtonVisibility();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Update position on scroll and resize
window.addEventListener('scroll', updateButtonVisibility);
window.addEventListener('resize', updateButtonVisibility);

// Update position every 0.1 seconds to handle dynamic changes like dragging
setInterval(updateButtonPosition, 100);