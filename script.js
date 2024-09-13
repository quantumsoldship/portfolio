document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('image-container');

    // Function to fetch images from the JSON file
    const fetchImages = () => {
        fetch('images.json')
            .then(response => response.json())
            .then(images => {
                images.forEach(image => {
                    const div = document.createElement('div');
                    div.classList.add('grid-item');
                    div.innerHTML = `<img src="images/${image}" alt="Image">`;
                    container.appendChild(div);
                });
                fadeInOnScroll();
            });
    };

    // Function to handle fade-in animation
    const fadeInOnScroll = () => {
        const windowHeight = window.innerHeight;
        document.querySelectorAll('.grid-item').forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom >= 0) {
                item.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Initial check

    fetchImages();
});