const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove invert and restore to 100% opacity, remove flickering comments
html = html.replace(/\/\* Fills PNG transparent images purely white \*\/\s*filter:\s*brightness\(0\)\s*invert\(1\);\s*opacity:\s*0\.15;\s*\/\*\s*Subtle and performant\s*\*\//g, 'opacity: 1;');
html = html.replace(/filter:\s*brightness\(0\)\s*invert\(1\);/g, '');
html = html.replace(/opacity:\s*0\.15;/g, 'opacity: 1;');

// Generate collision-based scattering
const slices = [];
const boxes = [];
// Protected center area for Name text + Button + Signature
// Use % of vh and vw. Safely block x: 15%->85%, y: 25%->75%
boxes.push({x: 10, y: 20, w: 80, h: 60});

let numPlaced = 0;
for (let i = 1; i <= 40; i++) {
    if (i === 22) continue; // skip 22

    let placed = false;
    let attempts = 0;
    
    // Size ranges around 5vw to 8vw.
    let vw = 4 + Math.random() * 4; 
    let vh = vw * 1.5; // Roughly map actual aspect height to vh percentage.

    while (!placed && attempts < 10000) {
        // Place around canvas
        let x = Math.random() * (95 - vw);
        let y = Math.random() * (95 - vh);
        
        let padX = 3; // Keep them from touching
        let padY = 4;
        
        let chX = x - padX;
        let chY = y - padY;
        let chW = vw + padX*2;
        let chH = vh + padY*2;

        let overlap = false;
        for (let b of boxes) {
            if (!(chX + chW < b.x ||
                  chX > b.x + b.w ||
                  chY + chH < b.y ||
                  chY > b.y + b.h)) {
                overlap = true;
                break;
            }
        }
        
        if (!overlap) {
            boxes.push({x: chX, y: chY, w: chW, h: chH});
            placed = true;
            numPlaced++;
            const rotate = Math.floor(Math.random() * 360);
            
            // Removed lazy loading and async decoding to directly prevent layout flickering on load
            slices.push(`        <img src="images/homepage/slice${i}.png" class="scatter-img" style="top: ${y}%; left: ${x}%; width: ${vw}vw; transform: rotate(${rotate}deg);" alt="" aria-hidden="true">`);
        }
        attempts++;
    }
}

const scatterHTML = `<div class="scatter-container">\n${slices.join('\n')}\n    </div>`;

// Safely match and switch out the body content
const start = html.indexOf('<div class="scatter-container">');
const hero = html.indexOf('<div class="hero-content">');
if (start > -1 && hero > -1) {
    html = html.substring(0, start) + scatterHTML + '\n\n        ' + html.substring(hero);
}

fs.writeFileSync('index.html', html);
console.log("Collision detection placed " + numPlaced + " out of 39 images using pure algorithmic padding.");
