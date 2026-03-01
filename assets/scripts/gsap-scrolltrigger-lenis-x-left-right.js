(function () {

    // GSAP + ScrollTrigger + Lenis ------------------------
    gsap.registerPlugin(ScrollTrigger);

    // Inicializa o Lenis (scroll suave)
    const lenis = new Lenis({
        duration: .2, // Controla a duração da animação do scroll (maior = mais suave)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva de easing
        smooth: true,
        smoothTouch: false, // Desabilitar em dispositivos touch se preferir
    });

    // Integra Lenis com o ScrollTrigger
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
        ScrollTrigger.update(); // Importante para sincronizar
    }

    requestAnimationFrame(raf);

    // Suas animações com delay e efeitos deslizantes
    function revealOnScrollXRight() {
        gsap.utils.toArray('.gsap-reveal-x-right').forEach((el, index) => {
            // Estado inicial
            gsap.set(el, {
                opacity: 0,
                x: 20,
                scale: 1
            });

            // Animação com delay baseado no índice
            ScrollTrigger.create({
                trigger: el,
                start: 'top 75%',
                end: 'bottom 20%',
                onEnter: () => {
                    gsap.to(el, {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 1.2,
                        delay: index * 0.1, // Delay progressivo entre elementos
                        ease: 'power3.out',
                        overwrite: true
                    });
                },
                onLeaveBack: () => {
                    gsap.to(el, {
                        opacity: 0,
                        x: 20,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        overwrite: true
                    });
                }
            });
        });
    }

    // Suas animações com delay e efeitos deslizantes
    function revealOnScrollXLeft() {
        gsap.utils.toArray('.gsap-reveal-x-left').forEach((el, index) => {
            // Estado inicial
            gsap.set(el, {
                opacity: 0,
                x: -20,
                scale: 1
            });

            // Animação com delay baseado no índice
            ScrollTrigger.create({
                trigger: el,
                start: 'top 75%',
                end: 'bottom 20%',
                onEnter: () => {
                    gsap.to(el, {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 1.2,
                        delay: index * 0.1, // Delay progressivo entre elementos
                        ease: 'power3.out',
                        overwrite: true
                    });
                },
                onLeaveBack: () => {
                    gsap.to(el, {
                        opacity: 0,
                        x: -20,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        overwrite: true
                    });
                }
            });
        });
    }

    window.addEventListener('load', () => {
        revealOnScrollXRight();
        revealOnScrollXLeft();
        setTimeout(() => ScrollTrigger.refresh(), 20);
    });

    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

})();