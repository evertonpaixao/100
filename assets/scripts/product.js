document.addEventListener('DOMContentLoaded', function() {
    // Elementos da galeria
    const mainImageContainer = document.getElementById('mainImageContainer');
    const mainImageTrack = document.getElementById('mainImageTrack');
    const mainImages = document.querySelectorAll('.main-image');
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselIndicators = document.getElementById('carouselIndicators');

    // Controle de quantidade
    const decrementBtn = document.getElementById('decrement'); 
    const incrementBtn = document.getElementById('increment');
    const quantityInput = document.getElementById('quantity');

    // Estado atual
    let currentIndex = 0;
    let startX, currentX, isDragging = false;
    let startScrollLeft, isThumbDragging = false;
    const thumbnailWidth = 92; // 80px width + 10px gap + 2px border

    // Criar indicadores do carrossel
    mainImages.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        carouselIndicators.appendChild(indicator);
    });

    const indicators = document.querySelectorAll('.indicator');

    // Função para atualizar o slide
    function goToSlide(index, animate = true) {
        if (index < 0) index = mainImages.length - 1;
        if (index >= mainImages.length) index = 0;
        
        currentIndex = index;
        
        // Atualizar posição do track
        const slideWidth = mainImageContainer.offsetWidth;
        mainImageTrack.style.transition = animate ? 'transform 0.3s ease' : 'none';
        mainImageTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        // Atualizar thumbnails
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[currentIndex].classList.add('active');
        
        // Atualizar indicadores
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
        });
        
        // Rolar thumbnail para visualização
        scrollToThumbnail(currentIndex);
    }

    // Função para rolar o carrossel de thumbnails
    function scrollToThumbnail(index) {
        const containerWidth = thumbnailsContainer.offsetWidth;
        const scrollPosition = index * thumbnailWidth - (containerWidth / 2) + (thumbnailWidth / 2);
        
        thumbnailsContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }

    // Drag functionality para imagem principal
    mainImageContainer.addEventListener('mousedown', startDrag);
    mainImageContainer.addEventListener('touchstart', startDrag, { passive: true });
    
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        currentX = startX;
        
        mainImageContainer.classList.add('dragging');
        mainImageTrack.style.transition = 'none';
        
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }
    
    function onDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const diff = x - startX;
        const slideWidth = mainImageContainer.offsetWidth;
        const currentTranslate = -currentIndex * slideWidth + diff;
        
        mainImageTrack.style.transform = `translateX(${currentTranslate}px)`;
        currentX = x;
    }
    
    function stopDrag(e) {
        if (!isDragging) return;
        
        const diff = currentX - startX;
        const slideWidth = mainImageContainer.offsetWidth;
        const threshold = slideWidth * 0.2; // 20% do slide para mudar
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Arrastou para direita -> slide anterior
                goToSlide(currentIndex - 1);
            } else {
                // Arrastou para esquerda -> próximo slide
                goToSlide(currentIndex + 1);
            }
        } else {
            // Não passou do threshold, volta para o slide atual
            goToSlide(currentIndex);
        }
        
        isDragging = false;
        mainImageContainer.classList.remove('dragging');
        
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }

    // Drag functionality para thumbnails
    thumbnailsContainer.addEventListener('mousedown', startThumbDrag);
    thumbnailsContainer.addEventListener('touchstart', startThumbDrag, { passive: true });
    
    function startThumbDrag(e) {
        // Não iniciar drag se clicou em um thumbnail específico
        if (e.target.classList.contains('thumbnail')) return;
        
        e.preventDefault();
        isThumbDragging = true;
        startScrollLeft = thumbnailsContainer.scrollLeft;
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        
        thumbnailsContainer.classList.add('dragging');
        thumbnailsContainer.style.scrollBehavior = 'auto';
        
        document.addEventListener('mousemove', onThumbDrag);
        document.addEventListener('touchmove', onThumbDrag, { passive: false });
        document.addEventListener('mouseup', stopThumbDrag);
        document.addEventListener('touchend', stopThumbDrag);
    }
    
    function onThumbDrag(e) {
        if (!isThumbDragging) return;
        e.preventDefault();
        
        const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const diff = startX - x;
        
        thumbnailsContainer.scrollLeft = startScrollLeft + diff;
    }
    
    function stopThumbDrag() {
        if (!isThumbDragging) return;
        
        isThumbDragging = false;
        thumbnailsContainer.classList.remove('dragging');
        thumbnailsContainer.style.scrollBehavior = 'smooth';
        
        document.removeEventListener('mousemove', onThumbDrag);
        document.removeEventListener('touchmove', onThumbDrag);
        document.removeEventListener('mouseup', stopThumbDrag);
        document.removeEventListener('touchend', stopThumbDrag);
        
        // Verificar se chegou ao fim e ajustar
        checkAndAdjustThumbScroll();
    }

    // Função para verificar scroll dos thumbnails
    function checkAndAdjustThumbScroll() {
        const container = thumbnailsContainer;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
            // Se chegou ao final, volta para o início
            setTimeout(() => {
                container.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            }, 100);
        } else if (container.scrollLeft <= 10) {
            // Se chegou ao início, vai para o final
            setTimeout(() => {
                container.scrollTo({
                    left: maxScroll,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // Event listeners para thumbnails
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(index);
        });
    });

    // Botões de navegação
    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });

    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
        }
    });

    // Controle de quantidade
    decrementBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    incrementBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
        }
    });

    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
            quantityInput.value = 1;
        } else if (value > 99) {
            quantityInput.value = 99;
        }
    });

    // Inicialização
    function initGallery() {
        // Ajustar altura do track
        const slideWidth = mainImageContainer.offsetWidth;
        mainImages.forEach(img => {
            img.style.width = `${slideWidth}px`;
        });
        goToSlide(0, false);
    }

    // Observar mudança de tamanho da janela
    window.addEventListener('resize', () => {
        const slideWidth = mainImageContainer.offsetWidth;
        mainImages.forEach(img => {
            img.style.width = `${slideWidth}px`;
        });
        goToSlide(currentIndex, false);
    });

    initGallery();
});