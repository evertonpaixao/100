(function () {
// SLIDER AUTOPLAY + DRAG (toque ou mouse) ------BANNER--------------
    const sliderContainer = document.getElementById('sliderContainer');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotContainer = document.getElementById('dotContainer');
    let currentIndex = 0;
    let slideInterval;

    // Variáveis para o drag
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    function updateDots() {
        let dotsHtml = '';
        slides.forEach((_, i) => {
            dotsHtml += `<div class="dot ${i === currentIndex ? 'active' : ''}" data-index="${i}"></div>`;
        });
        dotContainer.innerHTML = dotsHtml;
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', function (e) {
                const index = parseInt(e.target.getAttribute('data-index'));
                goToSlide(index);
                resetTimer();
            });
        });
    }

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentTranslate = index * -100;
        prevTranslate = currentTranslate;
        sliderContainer.style.transform = `translateX(${currentTranslate}%)`;

        currentIndex = index;
        updateDots();
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    function resetTimer() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
    }

    // Funções de drag
    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        sliderContainer.style.transition = 'none';
        resetTimer();
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            const diff = currentPosition - startPos;
            const slideWidth = sliderContainer.offsetWidth;
            const movePercent = (diff / slideWidth) * 100;

            currentTranslate = prevTranslate + movePercent;
            setSliderPosition();
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;

        // Se moveu mais de 20% para a direita, vai para o slide anterior
        if (movedBy > 20) {
            prevSlide();
        }
        // Se moveu mais de 20% para a esquerda, vai para o próximo slide
        else if (movedBy < -20) {
            nextSlide();
        }
        // Caso contrário, volta para o slide atual
        else {
            goToSlide(currentIndex);
        }

        sliderContainer.style.transition = 'transform 0.3s ease';
        resetTimer();
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }

    function setSliderPosition() {
        sliderContainer.style.transform = `translateX(${currentTranslate}%)`;
    }

    // Adicionar eventos de drag
    sliderContainer.addEventListener('touchstart', touchStart);
    sliderContainer.addEventListener('touchend', touchEnd);
    sliderContainer.addEventListener('touchmove', touchMove);
    sliderContainer.addEventListener('touchcancel', touchEnd);

    sliderContainer.addEventListener('mousedown', touchStart);
    sliderContainer.addEventListener('mouseup', touchEnd);
    sliderContainer.addEventListener('mousemove', touchMove);
    sliderContainer.addEventListener('mouseleave', touchEnd);

    // Prevenir o comportamento padrão de arrastar imagens
    sliderContainer.addEventListener('dragstart', (e) => e.preventDefault());

    prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
    nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });

    updateDots();
    slideInterval = setInterval(nextSlide, 4000);
})();