document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('nav');
    const hasSubmenu = document.querySelectorAll('.has-submenu');
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    // Toggle do menu hamburguer
    hamburgerBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar no overlay
    overlay.addEventListener('click', function() {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        this.classList.remove('active');
        document.body.style.overflow = '';
        
        // Fechar submenus abertos
        hasSubmenu.forEach(item => {
            item.classList.remove('active');
        });
    });

    // Funcionalidade do submenu no mobile
    hasSubmenu.forEach(item => {
        const link = item.querySelector('a');
        const chevron = item.querySelector('.menu-item');
        
        // Se não tiver link, usa o próprio item
        const clickable = chevron || item;
        
        clickable.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                // Fecha outros submenus abertos
                hasSubmenu.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                item.classList.toggle('active');
            }
        });
    });

    // Ajuste ao redimensionar a tela
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            hasSubmenu.forEach(item => {
                item.classList.remove('active');
            });
        }
    });
});