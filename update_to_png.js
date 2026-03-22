const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<img src="images\/homepage\/slice(\d+)\.svg"/g, '<img src="images/homepage/slice$1.png"');
fs.writeFileSync('index.html', html);
console.log("Updated SVG to PNG!");