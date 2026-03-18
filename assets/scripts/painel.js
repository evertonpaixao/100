// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do modal
    const modal = document.getElementById('confirm-modal-sair');
    const btnNao = document.getElementById('confirm-no-sair');
    const btnSim = document.getElementById('confirm-yes-sair');
        
    // Seleciona todas as sairLink (ícones de exclusão)
    const sairLink = document.querySelectorAll('.link-sair');
    
    // Adiciona evento de clique para cada sair
    sairLink.forEach(sair => {
        sair.addEventListener('click', function(e) {
            e.stopPropagation(); // Impede a propagação do evento
            
            // Exibe o modal
            modal.classList.add('show');
        });
    });
    
    // Evento para o botão "Não"
    btnNao.addEventListener('click', function() {
        // Fecha o modal
        modal.classList.remove('show');
    });
    
    // Evento para o botão "Sim"
    btnSim.addEventListener('click', function() {
            // Fecha o modal
            modal.classList.remove('show');
    });
    
    // Fecha o modal se clicar fora dele
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // Fecha o modal com a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });
    
    // Previne que cliques dentro do modal fechem ele
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});