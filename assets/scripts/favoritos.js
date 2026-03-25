// ===== FUNCIONALIDADE DO CORAÇÃO =====
document.querySelectorAll('.heart-icon').forEach(function(heartBtn) {

    heartBtn.addEventListener('click', function() {

        const card = this.closest('.product-card');
        const msg = card.querySelector('.favorite-message');

        const isActive = this.classList.toggle('active');

        if (isActive) {
            setTimeout(() => {
                this.classList.add('pulse');
            }, 400);

            msg.textContent = 'Adicionado aos favoritos!';
            createConfetti(this);
        } else {
            this.classList.remove('pulse');
            msg.textContent = 'Removido dos favoritos';
        }

        msg.classList.add('show');

        setTimeout(() => {
            msg.classList.remove('show');
        }, 2000);
    });

});

// Efeito de confete ao favoritar
function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = '#ff4757';
        particle.style.borderRadius = '50%';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        const angle = (i / 6) * Math.PI * 2;
        const velocity = 60;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => particle.remove();
    }
}