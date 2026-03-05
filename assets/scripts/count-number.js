document.addEventListener('DOMContentLoaded', function () {
    const stats = document.querySelectorAll('.statistic');

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = +stat.getAttribute('data-target');
                const duration = 2000; // Tempo total em milissegundos para a contagem
                const increment = target / (duration / 16); // Aproximadamente 60 FPS

                let count = 0;

                function updateCounter() {
                    count += increment;
                    if (count < target) {
                        stat.textContent = Math.ceil(count);
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target;
                    }
                }

                updateCounter();
                observer.unobserve(stat); // Para de observar o elemento depois de animado
            }
        });
    }, {
        threshold: 0.5 // Percentual do elemento visível para a animação começar
    });

    stats.forEach(stat => {
        observer.observe(stat);
    });
});