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

    // Elementos do modal - Cadastrar
    const successModal = document.getElementById('success-modal-address');
    const modalOkBtn = document.getElementById('modal-ok-btn-address');
    const form = document.querySelector('.form-dados-pessoais-address');

    function mostrarModalSucesso() {
        successModal.classList.add('show');
        document.getElementById('address-form').classList.remove('visible');
        document.getElementById('address-saves').classList.add('visible');
        document.getElementById('address-saves').classList.remove('hidden');

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
    // Configurar máscara e busca para ambos os campos de CEP
    configurarCampoCep('cep-cadastro', 'cadastro');
    configurarCampoCep('cep-editar', 'editar');
});

function configurarCampoCep(inputId, formType) {
    const cepInput = document.getElementById(inputId);
    
    if (!cepInput) return;
    
    // Máscara do CEP
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }
        e.target.value = value;
    });
    
    // Busca CEP no blur
    cepInput.addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        
        if (cep.length === 8) {
            // Feedback visual de loading
            this.style.backgroundColor = '#f0f0f0';
            this.disabled = true;
            
            buscarCep(cep, formType)
                .finally(() => {
                    cepInput.style.backgroundColor = '';
                    cepInput.disabled = false;
                });
        }
    });
}

async function buscarCep(cep, formType) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();
        
        if (dados.erro) {
            alert('CEP não encontrado!');
            limparCamposEndereco(formType);
            return;
        }
        
        preencherFormulario(dados, formType);
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar CEP. Tente novamente.');
    }
}

function preencherFormulario(dados, formType) {
    // Prefixo dos IDs baseado no tipo de formulário
    const prefixo = formType === 'cadastro' ? '-cadastro' : '-editar';
    
    // Preenche campos básicos
    document.getElementById(`rua${prefixo}`).value = dados.logradouro || '';
    document.getElementById(`bairro${prefixo}`).value = dados.bairro || '';
    document.getElementById(`complemento${prefixo}`).value = dados.complemento || '';
    
    // Preenche estado
    const estadoSelect = document.getElementById(`estado${prefixo}`);
    if (estadoSelect && dados.uf) {
        estadoSelect.value = dados.uf;
        
        // Se não conseguir setar pelo value, busca pela opção
        if (estadoSelect.value !== dados.uf) {
            for (let option of estadoSelect.options) {
                if (option.value === dados.uf) {
                    option.selected = true;
                    break;
                }
            }
        }
    }
    
    // Preenche cidade
    const cidadeSelect = document.getElementById(`cidade${prefixo}`);
    if (cidadeSelect && dados.localidade) {
        cidadeSelect.value = dados.localidade;
        
        // Se a cidade não existe no select, adiciona
        if (cidadeSelect.value !== dados.localidade) {
            // Remove opções existentes (mantém apenas a primeira)
            while (cidadeSelect.options.length > 1) {
                cidadeSelect.remove(1);
            }
            
            // Adiciona a nova cidade
            const novaOpcao = new Option(dados.localidade, dados.localidade, true, true);
            cidadeSelect.add(novaOpcao);
        }
    }
    
    // Feedback visual de sucesso
    const cepInput = document.getElementById(`cep${prefixo}`);
    cepInput.style.borderColor = '#4CAF50';
    setTimeout(() => {
        cepInput.style.borderColor = '';
    }, 2000);
}

function limparCamposEndereco(formType) {
    const prefixo = formType === 'cadastro' ? '-cadastro' : '-editar';
    
    document.getElementById(`rua${prefixo}`).value = '';
    document.getElementById(`bairro${prefixo}`).value = '';
    document.getElementById(`complemento${prefixo}`).value = '';
    document.getElementById(`estado${prefixo}`).selectedIndex = 0;
    
    // Limpa cidade
    const cidadeSelect = document.getElementById(`cidade${prefixo}`);
    while (cidadeSelect.options.length > 1) {
        cidadeSelect.remove(1);
    }
    cidadeSelect.selectedIndex = 0;
    
    // Feedback visual de erro
    const cepInput = document.getElementById(`cep${prefixo}`);
    cepInput.style.borderColor = '#f44336';
    setTimeout(() => {
        cepInput.style.borderColor = '';
    }, 2000);
}

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do modal
    const modal = document.getElementById('confirm-modal');
    const btnNao = document.getElementById('confirm-no');
    const btnSim = document.getElementById('confirm-yes');
    
    // Variável para armazenar o cartão a ser excluído
    let addressToDelete = null;
    
    // Seleciona todas as lixeiras (ícones de exclusão)
    const lixeiras = document.querySelectorAll('.address .modal-address .btn-excluir');
    
    // Adiciona evento de clique para cada lixeira
    lixeiras.forEach(lixeira => {
        lixeira.addEventListener('click', function(e) {
            e.stopPropagation(); // Impede a propagação do evento
            
            // Encontra o cartão pai mais próximo
            const address = this.closest('.address');
            
            // Armazena o cartão a ser excluído
            addressToDelete = address;
            
            // Exibe o modal
            modal.classList.add('show');
        });
    });
    
    // Evento para o botão "Não"
    btnNao.addEventListener('click', function() {
        // Fecha o modal
        modal.classList.remove('show');
        
        // Limpa a referência do cartão
        addressToDelete = null;
    });
    
    // Evento para o botão "Sim"
    btnSim.addEventListener('click', function() {
        if (addressToDelete) {
            // Remove o cartão do DOM
            addressToDelete.remove();
            
            // Fecha o modal
            modal.classList.remove('show');
            
            // Limpa a referência do cartão
            addressToDelete = null;
            
            // Opcional: Mostra uma mensagem de sucesso
            console.log('Cartão excluído com sucesso!');
            
            // Opcional: Você pode adicionar um feedback visual
            // Por exemplo, mostrar um toast ou mensagem temporária
        }
    });
    
    // Fecha o modal se clicar fora dele
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            addressToDelete = null;
        }
    });
    
    // Fecha o modal com a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            addressToDelete = null;
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


// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {

    // Seleciona todas as btnEditar 
    const btnEditar = document.querySelectorAll('.address .modal-address .btn-editar-address');
    
    // Adiciona evento de clique para cada editar
    btnEditar.forEach(editar => {
        editar.addEventListener('click', function(e) {
            e.stopPropagation(); // Impede a propagação do evento
            
           document.getElementById('address-saves').classList.add('hidden');
            document.getElementById('address-form-editar').classList.add('visible');
        });
    });

    document.querySelector('.cancel-btn-address').addEventListener('click', function() {
        document.getElementById('address-saves').classList.remove('hidden');
        document.getElementById('address-form-editar').classList.remove('visible');
    });

    // Elementos do modal - Editar
    const successModalEditar = document.getElementById('success-modal-address-editar');
    const modalOkBtnEditar = document.getElementById('modal-ok-btn-address-editar');
    const formEditar = document.querySelector('.form-dados-pessoais-address-editar');

    function mostrarModalSucessoEditar() {
        successModalEditar.classList.add('show');
        document.getElementById('address-form-editar').classList.remove('visible');
        document.getElementById('address-saves').classList.add('visible');
        document.getElementById('address-saves').classList.remove('hidden');

        setTimeout(() => {
            fecharModal(successModalEditar);
        }, 20000);
    }

    function fecharModal(modalEditar) {
        modalEditar.classList.remove('show');
    }

    formEditar.addEventListener('submit', function(e) {

        e.preventDefault(); // impede envio automático
        mostrarModalSucessoEditar();

    });

    modalOkBtnEditar.addEventListener('click', () => fecharModal(successModalEditar));

    window.addEventListener('click', (e) => {
        if (e.target === successModalEditar) {
            fecharModal(successModalEditar);
        }
    });


});


document.addEventListener('DOMContentLoaded', function() {

    const btnAction = document.querySelectorAll('.address .action');
    const modais = document.querySelectorAll('.modal-address');

    btnAction.forEach(action => {
        action.addEventListener('click', function(e) {
            e.stopPropagation();

            // 🔴 Fecha todos os modais
            modais.forEach(modal => {
                modal.classList.remove('visible');
            });

            // 🟢 Abre o modal correspondente
            const modal = this.closest('.address').querySelector('.modal-address');
            modal.classList.add('visible');
        });
    });

    //fechar ao clicar fora
    window.addEventListener('click', function() {
    document.querySelectorAll('.modal-address').forEach(modal => {
        modal.classList.remove('visible');
    });
});

});