const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, 'projects');
const imagesDir = path.join(__dirname, 'images');

const projects = fs.readdirSync(projectsDir).filter(p => fs.statSync(path.join(projectsDir, p)).isDirectory());

projects.forEach(project => {
    const projImagesDir = path.join(imagesDir, project);
    if (!fs.existsSync(projImagesDir)) return;
    
    const imageFiles = fs.readdirSync(projImagesDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
    
    // Sort logically like img1, img2, etc. somewhat if we can, else just alphabetical
    imageFiles.sort((a,b) => {
        const numA = a.match(/\d+/) ? parseInt(a.match(/\d+/)[0]) : 0;
        const numB = b.match(/\d+/) ? parseInt(b.match(/\d+/)[0]) : 0;
        if (numA && numB) return numA - numB;
        return a.localeCompare(b);
    });

    const jsonPath = path.join(projectsDir, project, project + '.json');
    if (fs.exconst fs = require('fs');
const pathdaconst path = require('pFil
const projectsDir = path.jo   const imagesDir = path.join(__dirname, 'images');

cby
const projects = fs.readdirSync(projectsDir).fildI
projects.forEach(project => {
    const projImagesDir = path.join(imagesDir, project);
    if (!fs.existsSync       const projImagesDir = pa{p    if (!fs.existsSync(projImagesDir)) return;
    
   fi    
    const imageFiles = fs.readdirSync(prn          
    // Sort logically like img1, img2, etc. somewhat if we can, else just alphabetical
    imageFiles.sort((a,b) => {
      ld    &    imageFiles.sort((a,b) => {
        const numA = a.match(/\d+/) ? parseInt(a.match          const numA = a.match(          const numB = b.match(/\d+/) ? parseInt(b.match(/\d+/)[0]) : 0at        if (numA && numB) return numA - numB;
        return a.locales         return a.localeCompare(b);
    });

;
    });

    const jsonPath = patag
    c node update_json_images.js
 EOF
node update_json_images.js
 
