const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Generate scatter items with absolute positioning
const slices = [];
for (let i = 1; i <= 40; i++) {
    if (i === 22) continue; // skip 22

    let tx, ty;
    // 0 = Top, 1 = Bottom, 2 = Left, 3 = Right
    let region = Math.floor(Math.random() * 4); 
    
    if (region === 0) { // Top edge
        tx = Math.random() * 100;
        ty = Math.random() * 25; 
    } else if (region === 1) { // Bottom edge
        tx = Math.random() * 100;
        ty = 75 + Math.random() * 25; 
    } else if (region === 2) { // Left edge
        tx = Math.random() * 25;
        ty = 25 + Math.random() * 50;
    } else { // Right edge
        tx = 75 + Math.random() * 25;
        ty = 25 + Math.random() * 50;
    }
    
    // Vary size between 3vw and 10vw
    const size = Math.floor(3 + Math.random() * 7); 
    const rotate = Math.floor(Math.random() * 360);
    
    slices.push(`        <img src="images/homepage/slice${i}.png" class="scatter-img" style="top: ${ty}%; left: ${tx}%; width: ${size}vw; transform: rotate(${rotate}deg);" alt="" aria-hidden="true" loading="lazy" decoding="async">`);
}

const scatterHTML = `<div class="scatter-container">\n${slices.join('\n')}\n    </div>`;

// 2. Replace old scatter-grid in HTML body
const gridStart = html.indexOf('<div class="scatter-grid">');
const heroContentStart = html.indexOf('<div class="hero-content">');

if (gridStart > -1 && heroContentStart > -1) {
    html = html.substring(0, gridStart) + scatterHTML + '\n\n    ' + html.substring(heroContentStart);
}

// 3. Gut all the old CSS rules related to the "bad grid"
html = html.replace(/\.scatter-grid\s*\{[\s\S]*?\n        \}/, '');
html = html.replace(/\.center-hole\s*\{[\s\S]*?\n        \}/, '');
html = html.replace(/\.scatter-image\s*\{[\s\S]*?\n        \}/, '');
html = html.replace(/@media \(min-width: 1200px\)\s*\{\s*\.center-hole\s*\{[\s\S]*?\n            \}\s*\}/, '');

const newCSS = `.scatter-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        }

        .scatter-img {
            position: absolute;
            object-fit: contain;
            /* Fills PNG transparent images purely white */
            filter: brightness(0) invert(1);
            opacity: 0.15; /* Subtle and performant */
        }`;

// Inject new CSS
html = html.replace(/\.signature \{/, `${newCSS}\n\n        .signature {`);

// 4. Update the mobile hidden class logic
html = html.replace(/\.scatter-grid \{\s*display: none;\s*\/\* Hide cluttered[^\n]*\n\s*\}/g, `.scatter-container {
                display: none; /* Hide cluttered scattered images on very small screens to keep text legible */
            }`);

// Clean up extra blank spaces safely
html = html.replace(/\n\s*\n\s*\n\s*\n/g, '\n\n');

fs.writeFileSync('index.html', html);
console.log("Improved randomness, fixed performance, and added brightness(0) invert(1) for pure white fill.");
