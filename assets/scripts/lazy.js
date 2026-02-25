// Lazy Loading para imagens
document.addEventListener("DOMContentLoaded", function() {
    // Lazy loading para imagens
    const lazyImages = document.querySelectorAll('img.lazy-img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-img');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores antigos
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }

    // Lazy loading para vídeos
    const lazyVideos = document.querySelectorAll('video.lazy-video');
    
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    const sources = video.querySelectorAll('source');
                    
                    sources.forEach(source => {
                        source.src = source.dataset.src;
                    });
                    
                    video.load();
                    video.classList.remove('lazy-video');
                    
                    // Se o vídeo tiver autoplay, começar a reproduzir
                    if (video.autoplay) {
                        video.play().catch(e => console.log('Autoplay prevented:', e));
                    }
                    
                    videoObserver.unobserve(video);
                }
            });
        }, {
            threshold: 0.1 // Carrega quando 10% do vídeo está visível
        });

        lazyVideos.forEach(video => videoObserver.observe(video));
    } else {
        // Fallback para navegadores antigos
        lazyVideos.forEach(video => {
            const sources = video.querySelectorAll('source');
            sources.forEach(source => {
                source.src = source.dataset.src;
            });
            video.load();
        });
    }
});