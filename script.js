// Global variables
let currentScreen = 'door';
let flipbook;
let currentPage = 1;
const totalPages = 13;
let isDoorOpening = false;

// Sound effects
const pageFlipSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
const doorOpenSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');

// DOM elements
const doorScreen = document.getElementById('door-screen');
const invitationScreen = document.getElementById('invitation-screen');
const flipbookScreen = document.getElementById('flipbook-screen');
const doorLeft = document.getElementById('door-left');
const doorRight = document.getElementById('door-right');
const bottomText = document.getElementById('bottom-text');
const invitationBehind = document.getElementById('invitation-behind');
const prevBtn = document.getElementById('prev-btn');
const nextFlipBtn = document.getElementById('next-flip-btn');
const pageInfo = document.getElementById('page-info');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add click event to invitation screen
    invitationScreen.addEventListener('click', goToFlipbook);
    
    // Add click events to flipbook controls
    prevBtn.addEventListener('click', previousPage);
    nextFlipBtn.addEventListener('click', nextPage);
    
    // Add back to door button
    const backToDoorBtn = document.getElementById('back-to-door');
    if (backToDoorBtn) {
        backToDoorBtn.addEventListener('click', goBackToInvitation);
    }
    
    // Add touch/swipe support for mobile
    addTouchSupport();
    
    // Preload images for better performance
    preloadImages();
    
    // Check if we're on laptop/desktop (skip door animation)
    if (window.innerWidth >= 1024) {
        // Skip door animation for laptops, go straight to invitation
        doorScreen.classList.remove('active');
        invitationScreen.classList.add('active');
        currentScreen = 'invitation';
    } else {
        // Auto-open door after 2 seconds for mobile
        setTimeout(() => {
            openDoor();
        }, 2000);
    }
    
    // Initialize flipbook when needed
    setTimeout(() => {
        if (currentScreen === 'flipbook') {
            initializeFlipbook();
        }
    }, 1000);
}

function openDoor() {
    if (isDoorOpening) return;
    
    isDoorOpening = true;
    
    // Play door opening sound
    playSound(doorOpenSound);
    
    // Phase 1: Zoom to door and hide bottom text
    doorScreen.classList.add('door-zooming');
    
    // Phase 2: Open the door after zoom completes
    setTimeout(() => {
        doorScreen.classList.remove('door-zooming');
        doorScreen.classList.add('door-opening');
        
        // Phase 3: Show invitation screen
        setTimeout(() => {
            doorScreen.classList.remove('active');
            invitationScreen.classList.add('active');
            currentScreen = 'invitation';
        }, 1500);
    }, 800);
}

function goToFlipbook() {
    invitationScreen.classList.remove('active');
    flipbookScreen.classList.add('active');
    currentScreen = 'flipbook';
    
    // Initialize flipbook
    initializeFlipbook();
}

function goBackToInvitation() {
    flipbookScreen.classList.remove('active');
    invitationScreen.classList.add('active');
    currentScreen = 'invitation';
}

function initializeFlipbook() {
    const flipbookElement = document.getElementById('flipbook');
    
    if (flipbookElement && typeof $ !== 'undefined') {
        // Destroy existing flipbook if it exists
        if (flipbook) {
            flipbook.turn('destroy');
        }
        
        flipbook = $(flipbookElement).turn({
            width: window.innerWidth,
            height: window.innerHeight,
            autoCenter: false,
            acceleration: true,
            gradients: true,
            elevation: 50,
            duration: 800,
            when: {
                start: function(event, page, view) {
                    // Add flipping animation when page starts turning
                    $('.page').removeClass('page-flipping');
                    $(`.page:nth-child(${page})`).addClass('page-flipping');
                },
                turning: function(event, page, view) {
                    currentPage = page;
                    updatePageInfo();
                    updateControlButtons();
                },
                turned: function(event, page, view) {
                    // Add subtle animation when page is turned
                    $('.page').removeClass('page-turned page-flipping');
                    $(`.page:nth-child(${page})`).addClass('page-turned');
                }
            }
        });
        
        // Update initial state
        updatePageInfo();
        updateControlButtons();
    } else {
        // Fallback if Turn.js is not loaded
        console.warn('Turn.js not loaded, using fallback navigation');
        setupFallbackNavigation();
    }
}

function setupFallbackNavigation() {
    const pages = document.querySelectorAll('#flipbook .page');
    pages.forEach((page, index) => {
        page.style.display = index === 0 ? 'flex' : 'none';
    });
    
    updatePageInfo();
    updateControlButtons();
}

function playSound(audio) {
    try {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Sound play failed:', e));
    } catch (e) {
        console.log('Sound error:', e);
    }
}

function nextPage() {
    playSound(pageFlipSound);
    
    if (flipbook) {
        flipbook.turn('next');
    } else {
        // Fallback navigation
        const pages = document.querySelectorAll('#flipbook .page');
        if (currentPage < totalPages) {
            pages[currentPage - 1].style.display = 'none';
            pages[currentPage].style.display = 'flex';
            currentPage++;
            updatePageInfo();
            updateControlButtons();
        }
    }
}

function previousPage() {
    playSound(pageFlipSound);
    
    if (flipbook) {
        flipbook.turn('previous');
    } else {
        // Fallback navigation
        const pages = document.querySelectorAll('#flipbook .page');
        if (currentPage > 1) {
            pages[currentPage - 1].style.display = 'none';
            pages[currentPage - 2].style.display = 'flex';
            currentPage--;
            updatePageInfo();
            updateControlButtons();
        }
    }
}

function updatePageInfo() {
    pageInfo.textContent = `${currentPage} / ${totalPages}`;
}

function updateControlButtons() {
    prevBtn.disabled = currentPage <= 1;
    nextFlipBtn.disabled = currentPage >= totalPages;
}

function addTouchSupport() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    const flipbookElement = document.getElementById('flipbook');
    
    flipbookElement.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, false);
    
    flipbookElement.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - previous page
                previousPage();
            } else {
                // Swipe left - next page
                nextPage();
            }
        }
    }
}

function preloadImages() {
    const imageUrls = [
        'data/left_door.jpeg',
        'data/right_door.jpeg', 
        'data/left_bottom_text.jpeg',
        'data/right_bottom_text.jpeg',
        'data/2.jpeg'
    ];
    
    // Add flipbook image URLs
    for (let i = 3; i <= 15; i++) {
        imageUrls.push(`data/${i}.jpeg`);
    }
    
    let loadedCount = 0;
    const totalImages = imageUrls.length;
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.onload = function() {
            loadedCount++;
            if (loadedCount === totalImages) {
                console.log('All images preloaded successfully');
            }
        };
        img.onerror = function() {
            console.warn(`Failed to load image: ${url}`);
            loadedCount++;
        };
        img.src = url;
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    if (flipbook && currentScreen === 'flipbook') {
        flipbook.turn('size', window.innerWidth, window.innerHeight);
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (currentScreen === 'flipbook') {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                previousPage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextPage();
                break;
            case ' ':
                e.preventDefault();
                nextPage();
                break;
        }
    }
});

// Prevent context menu on long press
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add page turn animation CSS
const style = document.createElement('style');
style.textContent = `
    .page-turned {
        animation: pageTurn 0.6s ease-in-out;
    }
    
    @keyframes pageTurn {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    /* Custom Turn.js styles for full screen */
    .turn-page {
        background: #000 !important;
    }
    
    .turn-page img {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
    }
`;
document.head.appendChild(style);