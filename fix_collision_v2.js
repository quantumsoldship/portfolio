const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Generate true collision-based scattering
const slices = [];
const boxes = [];
// Narrower center footprint: x:20 to 80, y:25 to 75. Just covering text/button safely.
boxes.push({x: 20, y: 25, w: 60, h: 50});

let numPlaced = 0;
for (let i = 1; i <= 40; i++) {
    if (i === 22) continue; // skip 22

    let placed = false;
    let attempts = 0;
    
    // Adjusted size smaller so we can successfully pack all 39 elements
    let vw = 3 + Math.random() * 3; // 3vw to 6vw
    let vh = vw * 1.5; 

    while (!placed && attempts < 25000) {
        let x = Math.random() * (96 - vw);
        let y = Math.random() * (96 - vh);
        
        // Minor padding ensuring they absolutely never touch bounds
        let padX = 1;  
        let padY = 1.5;
        
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
            slices.push(`        <img src="images/homepage/slice${i}.png" class="scatter-img" style="top: ${y}%; left: ${x}%; width: ${vw}vw; transform: rotate(${rotate}deg);" alt="" aria-hidden="true">`);
        }
        attempts++;
    }
}

const scatterHTML = `<div class="scatter-container">\n${slices.join('\n')}\n    </div>`;

const start = html.indexOf('<div class="scatter-container">');
const hero = html.indexOf('<div class="hero-content">');
if (start > -1 && hero > -1) {
    html = html.substring(0, start) + scatterHTML + '\n\n        ' + html.substring(hero);
}

fs.writeFileSync('index.html', html);
console.log("Placed: " + numPlaced + " out of 39 images completely standalone.");
