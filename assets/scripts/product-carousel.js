(function () {
    // CARROSSEL PRODUTOS ---------------------
    const carousel = document.getElementById('productCarousel');
    const leftArr = document.getElementById('carouselLeft');
    const rightArr = document.getElementById('carouselRight');
    const cardWidth = () => {
        if (window.innerWidth <= 720) return carousel.clientWidth * 0.9;
        else return (carousel.querySelector('.product-card')?.clientWidth || 280) + 30;
    };

    leftArr.addEventListener('click', () => { carousel.scrollLeft -= cardWidth(); });
    rightArr.addEventListener('click', () => { carousel.scrollLeft += cardWidth(); });
})();