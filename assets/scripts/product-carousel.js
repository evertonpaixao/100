(function () {
    // CARROSSEL PRODUTOS ---------------------
    const carousel = document.getElementById('productCarousel');
    const leftArr = document.getElementById('carouselLeft');
    const rightArr = document.getElementById('carouselRight');
    
    // Drag functionality variables
    let isDragging = false;
    let startX;
    let scrollLeft;
    
    const cardWidth = () => {
        if (window.innerWidth <= 720) return carousel.clientWidth * 0.9;
        else return (carousel.querySelector('.product-card')?.clientWidth || 280) + 30;
    };

    // Arrow click events
    leftArr.addEventListener('click', () => { 
        carousel.scrollLeft -= cardWidth(); 
    });
    
    rightArr.addEventListener('click', () => { 
        carousel.scrollLeft += cardWidth(); 
    });

    // Drag functionality for desktop
    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        carousel.style.cursor = 'grabbing';
        carousel.style.userSelect = 'none';
    });

    carousel.addEventListener('mouseleave', () => {
        isDragging = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
        isDragging = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Prevent default drag behavior on images
    carousel.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // Set initial cursor style
    carousel.style.cursor = 'grab';
})();