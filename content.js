'use strict';

let miniplayerButton = null;

// Function to create the miniplayer button if it doesn't exist
function createMiniplayerButton() {
    if (miniplayerButton) return;
    miniplayerButton = document.createElement('button');
    miniplayerButton.className = 'miniplayer-btn';
    miniplayerButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="10" height="8" rx="1" ry="1" fill="white" stroke="black" stroke-width="1.5"/>
        <rect x="6" y="6" width="8" height="6" rx="1" ry="1" fill="white" stroke="black" stroke-width="1.5"/>
    </svg>`; // Miniplayer icon with overlapping rectangles
    miniplayerButton.style.cssText = `
        position: fixed;
        z-index: 1000000;
        background: white;
        border: 1px solid #ccc;
        border-radius: 3px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        pointer-events: auto;
        display: none; /* Initially hidden */
    `;

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

// Function to update button visibility based on video presence
function updateButtonVisibility() {
    const videos = document.querySelectorAll('video');
    if (videos.length > 0) {
        // Position near the first video
        const video = videos[0];
        let container = video.closest('#movie_player') || video.closest('#player') || video.closest('.html5-video-player') || video.parentNode;
        const rect = container.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            miniplayerButton.style.left = (rect.left + 5) + 'px';
            miniplayerButton.style.top = (rect.top + 5) + 'px';
            miniplayerButton.style.display = 'flex';
        } else {
            miniplayerButton.style.display = 'none';
        }
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