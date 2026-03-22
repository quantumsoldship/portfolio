const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, 'projects');
const imagesDir = path.join(__dirname, 'images');

const projects = fs.readdirSync(projectsDir).filter(p => fs.statSync(path.join(projectsDir, p)).isDirectory());

projects.forEach(project => {
    const projImagesDir = path.join(imagesDir, project);
    if (!fs.existsSync(projImagesDir)) return;
    
    let imageFiles = fs.readdirSync(projImagesDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
    
    imageFiles.sort((a,b) => {
        const numA = a.match(/\d+/) ? parseInt(a.match(/\d+/)[0]) : 0;
        const numB = b.match(/\d+/) ? parseInt(b.match(/\d+/)[0]) : 0;
        if (numA && numB) return numA - numB;
        return a.localeCompare(b);
    });

    const jsonPath = path.join(projectsDir, project, project + '.json');
    if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const oldImages = data.project.images || [];
        
        const newImages = imageFiles.map((file, idx) => {
            const srcPath = `./images/${project}/${file}`;
            const oldImg = oldImages.find(i => i.src === srcPath || i.src.endsWith(file));
            return {
                id: idx + 1,
                src: srcPath,
                alt: oldImg ? oldImg.alt : "",
                caption: oldImg && oldImg.caption && oldImg.caption !== "Optional caption" ? oldImg.caption : ""
            };
        });
        
        data.project.images = newImages;
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 4));
        console.log(`Updated images for ${project}:`, newImages.map(i => i.src));
    }
});
