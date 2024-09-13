document.addEventListener('DOMContentLoaded', () => {
    const gridItems = document.querySelectorAll('.grid-item');

    const fadeInOnScroll = () => {
        const windowHeight = window.innerHeight;
        gridItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom >= 0) {
                item.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Initial check
});