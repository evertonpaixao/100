document.addEventListener('DOMContentLoaded', function() {

    // Elementos do modal    
    const successModal = document.getElementById('success-modal');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const form = document.getElementById('form-conta');

    function mostrarModalSucesso() {
        successModal.classList.add('show');

        setTimeout(() => {
            fecharModal(successModal);
            window.location.href = 'index.html';
        }, 20000);
    }

    function fecharModal(modal) {
        modal.classList.remove('show');
    }

    form.addEventListener('submit', function(e) {

        e.preventDefault(); // impede envio automático
        mostrarModalSucesso();        

    });

    modalOkBtn.addEventListener('click', () => fecharModal(successModal));

    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            fecharModal(successModal);
        }
    });

});