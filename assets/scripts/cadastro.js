document.getElementById('email-confirmar').addEventListener('input', function() {
    const email = document.getElementById('email').value;
    this.setCustomValidity(this.value !== email ? 'Os e-mails não coincidem' : '');
});

document.querySelectorAll('.senha')[1].addEventListener('input', function() {
    const senha = document.querySelectorAll('.senha')[0].value;
    this.setCustomValidity(this.value !== senha ? 'As senhas não coincidem' : '');
}); 

document.addEventListener('DOMContentLoaded', function() {

    // CPF: 000.000.000-00
    document.getElementById('cpf').addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = v;
    });

    // Telefone: (00) 00000-0000 ou (00) 0000-0000
    document.getElementById('telefone').addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');

        if (v.length > 10) {
            v = v.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
        } else {
            v = v.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
        }

        e.target.value = v;
    });

    // Data: 00/00/0000
    document.getElementById('data').addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        v = v.replace(/(\d{2})(\d)/, '$1/$2');
        v = v.replace(/(\d{2})(\d)/, '$1/$2');
        e.target.value = v;
    });

});


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