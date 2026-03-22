const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove invert(1)
html = html.replace(/filter: invert\(1\); \/\* Ensure SVGs render correctly.*? \*\//g, '');
html = html.replace(/filter: invert\(1\);/g, '');

// 2. We need to replace the scattered images in HTML
const slices = [];
for (let i = 1; i <= 40; i++) {
    if (i === 22) continue; // no slice22
    // We can add random rotation for styling logic (optional)
    const rotate = Math.floor(Math.random() * 40 - 20); // -20 to 20 deg
    slices.push(`            <img src="images/homepage/slice${i}.svg" class="scatter-image" style="transform: rotate(${rotate}deg);" alt="" aria-hidden="true" loading="lazy">`);
}

// create grid container wrapping them
const gridHTML = `
    <div class="scatter-grid">
        <div class="center-hole"></div>
${slices.join('\n')}
    </div>
`

// Find the hero container
// Delete the old slices (scatter-1 through scatter-8)
html = html.replace(/<img src="images\/homepage\/slice[\s\S]*?aria-hidden="true">\n/g, '');
html = html.replaceAll('            <img src="images/homepage/slice1.svg" class="scatter-image scatter-1" alt="" aria-hidden="true">\n', '');
html = html.replaceAll('            <img src="images/homepage/slice2.svg" class="scatter-image scatter-2" alt="" aria-hidden="true">\n', '');
html = html.replaceAll('            <img src="images/homepage/slice3.svg" class="scatter-image scatter-3" alt="" aria-hidden="true">\n', '');
html = html.replaceAll('            <img src="images/homepage/slice4.svg" class="scatter-image scatter-4" alt="" aria-hidden="true">\n', '');
html = html.replaceAll('            <img src="images/homepage/slice5.svg" class="scatter-image scatter-5" alt="" aria-hidden="true">\n', '');
html = html.replaceAll('            <img src="images/homepage/slice6.svg" class="scatter-image scatter-6" alt="" aria-hidden="true">\n', '');
html = html.replaceAll('            <img src="images/homepage/slice7.svg" class="scatter-image scatter-7" alt="" aria-hidden="true">\n', '');
html = html.replaceAll('            <img src="images/homepage/slice8.svg" class="scatter-image scatter-8" alt="" aria-hidden="true">\n', '');

// Insert the gridHTML right before hero-content
html = html.replace('<div class="hero-content">', gridHTML + '\n        <div class="hero-content">');

// Now rewrite the CSS for scattered images
const oldCSSToReplace = `.scatter-image {
            position: absolute;
            pointer-events: none;
            z-index: 5;
            will-change: transform;
            opacity: 0.8;
            
        }
        
        /* Specific rules for scattering the images around the text */
        .scatter-1 { top: -15%; left: -20%; width: 15vw; max-width: 120px; }
        .scatter-2 { top: -10%; right: -25%; width: 12vw; max-width: 90px; }
        .scatter-3 { bottom: -10%; left: -30%; width: 18vw; max-width: 140px; }
        .scatter-4 { bottom: -5%; right: -20%; width: 14vw; max-width: 110px; }
        .scatter-5 { top: 40%; left: -40%; width: 10vw; max-width: 80px; }
        .scatter-6 { top: 50%; right: -35%; width: 16vw; max-width: 130px; }
        .scatter-7 { top: -30%; left: 20%; width: 13vw; max-width: 100px; }
        .scatter-8 { bottom: -25%; right: 10%; width: 15vw; max-width: 115px; }`;

const newCSS = `.scatter-grid {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-template-rows: repeat(7, 1fr);
            grid-auto-flow: dense;
            pointer-events: none;
            z-index: 1;
            padding: 2vw;
            box-sizing: border-box;
            gap: 2vw;
            overflow: hidden;
        }

        .center-hole {
            grid-column: 2 / 7;
            grid-row: 3 / 6;
        }

        .scatter-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            opacity: 0.9;
            will-change: transform;
            /* Randomize placement slightly with self-alignment */
            align-self: center;
            justify-self: center;
        }

        @media (min-width: 1200px) {
            .center-hole {
                grid-column: 3 / 6; /* tighter center on big screens */
            }
        }`;

html = html.replace(oldCSSToReplace, newCSS);

// For mobile, .scatter-image is set to display: none. Keep it, but change to .scatter-grid so the whole grid is hidden.
html = html.replace('.scatter-image {\n                display: none; /* Hide cluttered scattered images on very small screens to keep text legible */\n            }', '.scatter-grid {\n                display: none; /* Hide cluttered scattered images on very small screens to keep text legible */\n            }');
        
fs.writeFileSync('index.html', html);
console.log("Updated!");
