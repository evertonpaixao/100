document.querySelector('.add-address').addEventListener('click', function() {
  document.getElementById('address-saves').classList.add('hidden');
  document.getElementById('address-form').classList.add('visible');
});

document.querySelector('.cancel-btn').addEventListener('click', function() {
  document.getElementById('address-saves').classList.remove('hidden');
  document.getElementById('address-form').classList.remove('visible');
});

document.querySelector('.btn-editar').addEventListener('click', function() {
  this.style.display = "none";
   //document.getElementById("btnSalvar").style.display = "inline-block";
   document.querySelector(".btn-salvar").style.display = "inline-block";
   // Seleciona todos os inputs dentro do formulário
    const inputs = document.querySelectorAll(".form-dados-pessoais input");

    // Remove o disabled de cada um
    inputs.forEach(function(input) {
        input.disabled = false;
    });
});

document.addEventListener('DOMContentLoaded', function() {

    // Elementos do modal
    
    const successModal = document.getElementById('success-modal');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const form = document.querySelector('.form-dados-pessoais');

    function mostrarModalSucesso() {
        successModal.classList.add('show');

        setTimeout(() => {
            fecharModal(successModal);
        }, 20000);
    }

    function fecharModal(modal) {
        modal.classList.remove('show');
    }

    form.addEventListener('submit', function(e) {

        e.preventDefault(); // impede envio automático
        mostrarModalSucesso();
        // Seleciona todos os inputs dentro do formulário
        const inputs = document.querySelectorAll(".form-dados-pessoais input:not([type='submit'])");

        // Desabilita só os campos (menos o submit)
        inputs.forEach(function(input) {
            input.disabled = true;
        });

        document.querySelector(".btn-salvar").style.display = "none";
        document.querySelector(".btn-editar").style.display = "block";

    });

    modalOkBtn.addEventListener('click', () => fecharModal(successModal));

    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            fecharModal(successModal);
        }
    });

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

    // CEP: 00000-000
    document.getElementById('cep').addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        v = v.replace(/(\d{5})(\d)/, '$1-$2');
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
