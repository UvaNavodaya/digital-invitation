# Digital Invitation

An interactive digital invitation with a flipbook feature for daily plans.

## Features

- **Door Reveal**: Click the door image to reveal the main invitation
- **Interactive Flipbook**: Navigate through daily plans (13 pages) with smooth page turning
- **Mobile Responsive**: Optimized for mobile devices with touch/swipe support
- **Smooth Animations**: Subtle transitions and page turn effects
- **Keyboard Navigation**: Use arrow keys to navigate the flipbook

## File Structure

```
project-folder/
├── index.html          # Main HTML file
├── style.css           # CSS styling and animations
├── script.js           # JavaScript functionality
├── README.md           # This file
└── data/               # Image folder
    ├── 1.jpeg          # Door image
    ├── 2.jpeg          # Main invitation
    ├── 3.jpeg          # Day 1 plan
    ├── ...
    └── 15.jpeg         # Day 13 plan
```

## How to Use

1. Open `index.html` in a web browser
2. Click the door image to reveal the invitation
3. Click "Next" to enter the flipbook
4. Navigate through pages using:
   - Click the Previous/Next buttons
   - Swipe left/right on mobile
   - Use arrow keys on desktop

## Deployment

This project is ready for deployment on GitHub Pages:

1. Upload all files to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Select the main branch as source
4. Your invitation will be available at `https://username.github.io/repository-name`

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- Turn.js library (loaded via CDN)
- No additional dependencies required

## Customization

- Replace images in the `data/` folder with your own
- Modify colors and styling in `style.css`
- Adjust animations and transitions in `script.js`
