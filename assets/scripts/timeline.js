(function () {
    const carousel = document.getElementById('timelineCarousel');
    const wrapper = document.getElementById('timelineWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // === DRAG TO SCROLL (mouse/touch draggable) ===
    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse events
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active'); // for grab cursor
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        // prevent default to avoid accidental selection while dragging
        e.preventDefault();
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // prevent selection while dragging
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.8; // sensitivity
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile dragging
    carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('touchend', () => {
        isDown = false;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.8;
        carousel.scrollLeft = scrollLeft - walk;
    });

    // === BUTTON NAVIGATION (smooth scroll to next/prev card) ===
    function getCardWidth() {
        if (carousel.children.length > 0) {
            // get computed width of first card + gap (gap is 2rem = 32px)
            const firstCard = carousel.children[0];
            const style = window.getComputedStyle(carousel);
            const gap = parseFloat(style.columnGap) || 32; // fallback 2rem
            return firstCard.offsetWidth + gap;
        }
        return 320 + 32; // fallback
    }

    function snapTo(direction) {
        const cardScrollAmount = getCardWidth();
        const currentScroll = carousel.scrollLeft;
        let targetScroll;

        if (direction === 'prev') {
            targetScroll = Math.max(0, currentScroll - cardScrollAmount);
        } else {
            // next: scroll right
            targetScroll = Math.min(carousel.scrollWidth - carousel.clientWidth, currentScroll + cardScrollAmount);
        }

        carousel.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    }

    prevBtn.addEventListener('click', () => snapTo('prev'));
    nextBtn.addEventListener('click', () => snapTo('next'));

    // === update gradient edge classes (optional for fade hints) ===
    function updateEdgeIndicators() {
        const scrollLeft = carousel.scrollLeft;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;

        if (scrollLeft <= 5) {
            wrapper.classList.add('at-start');
        } else {
            wrapper.classList.remove('at-start');
        }

        if (scrollLeft >= maxScroll - 5) {
            wrapper.classList.add('at-end');
        } else {
            wrapper.classList.remove('at-end');
        }
    }

    carousel.addEventListener('scroll', updateEdgeIndicators);
    window.addEventListener('resize', () => {
        updateEdgeIndicators();
    });

    // initial check
    setTimeout(updateEdgeIndicators, 50);
    updateEdgeIndicators();

    // optional: keyboard left/right (bonus)
    carousel.addEventListener('keydown', (e) => {
        // only if focus is inside carousel (but we don't have tabbable items, so it's fine)
    });
    // make carousel focusable for keyboard arrows, but we can add tabindex
    carousel.setAttribute('tabindex', '0');
    carousel.style.outline = 'none'; // remove focus ring, but keep for accessibility we can style
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            snapTo('prev');
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            snapTo('next');
        }
    });

    // disable user-select while dragging is already prevented, but fine.
    // ensure images don't cause drag (there are none)
})();