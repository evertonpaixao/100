document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona todas as divs com a classe "quantidade"
    const quantityContainers = document.querySelectorAll('.quantidade-produto');
    
    // Para cada container, configura os eventos
    quantityContainers.forEach(container => {
        const decrementBtn = container.querySelector('.decrement');
        const incrementBtn = container.querySelector('.increment');
        const quantityInput = container.querySelector('.quantity-input');
        
        // Evento de decremento
        decrementBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        // Evento de incremento
        incrementBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < 99) {
                quantityInput.value = currentValue + 1;
            }
        });
        
        // Evento de mudança no input
        quantityInput.addEventListener('change', () => {
            let value = parseInt(quantityInput.value);
            if (isNaN(value) || value < 1) {
                quantityInput.value = 1;
            } else if (value > 99) {
                quantityInput.value = 99;
            }
        });
    });
    
});

// Seleciona os elementos
const inputFrete = document.querySelector('.input-frete');
const buttonFrete = document.querySelector('.button-frete');
const mensagem = document.querySelector('.mensagem');
const contentFrete = document.querySelector('.content-frete');
const boxFreteCep = document.querySelector('.box-frete-cep');
const mensagemFrete = document.querySelector('.mensagem-frete');
const linkFrete = document.querySelector('.link-frete');
const cepNegrito = document.querySelector('.cep-negrito'); // Elemento <b> onde o CEP será exibido
const boxFreteInput = document.querySelector('.box-frete-input');
const buttonFreteAlterar = document.querySelector('.button-frete-alterar');

// Função para aplicar máscara de CEP
function mascaraCEP(input) {
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    if (value.length > 5) {
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    
    input.value = value;
}

// Função para validar CEP
function validarCEP(cep) {
    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');
    
    // Verifica se tem 8 dígitos
    if (cep.length !== 8) {
        return false;
    }
    
    // Verifica se não é uma sequência inválida (ex: 00000000, 11111111, etc)
    const cepInvalido = /^(\d)\1{7}$/.test(cep);
    if (cepInvalido) {
        return false;
    }
    
    return true;
}

// Aplica máscara enquanto digita
inputFrete.addEventListener('input', function() {
    mascaraCEP(this);
    
    // Limpa mensagens anteriores enquanto digita
    mensagem.textContent = '';
});

// Evento de clique no botão
buttonFrete.addEventListener('click', function() {
    const cepDigitado = inputFrete.value.trim();
    
    // Verifica se o campo está vazio
    if (cepDigitado === '') {
        mensagem.textContent = 'Por favor, preencha o campo de frete.';
        mensagem.style.color = 'red'; // opcional: estilizar a mensagem
        return;
    }
    
    // Remove a máscara para validar apenas os números
    const cepNumeros = cepDigitado.replace(/\D/g, '');
    
    if (validarCEP(cepDigitado)) {
        // CEP válido
        mensagem.textContent = ''; // Limpa mensagem de erro
        
        // Garante que o CEP está no formato correto com máscara
        const cepFormatado = cepNumeros.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        inputFrete.value = cepFormatado;
        
        // ATUALIZA O CEP EM NEGRITO NO HTML
        cepNegrito.textContent = cepFormatado;
        
        // Exibe as divs
        contentFrete.style.display = 'flex';
        boxFreteCep.style.display = 'flex';
        
        // Oculta a mensagem-frete
        mensagemFrete.style.display = 'none';
        linkFrete.style.display = 'none';        
        boxFreteInput.style.display = 'none';

        // Aqui você pode adicionar a lógica para buscar o endereço com o CEP
        console.log('CEP válido:', inputFrete.value);
        
        // Exemplo de busca de CEP (opcional)
        buscarEndereco(cepNumeros);
        
    } else {
        // CEP inválido
        mensagem.textContent = 'CEP inválido. Digite um CEP válido com 8 números.';
        mensagem.style.color = 'red'; // opcional: estilizar a mensagem
        
        // Garante que as divs fiquem ocultas
        contentFrete.style.display = 'none';
        boxFreteCep.style.display = 'none';
        mensagemFrete.style.display = 'block'; // Reexibe a mensagem se estava oculta
    }
});

// Evento de clique no botão
buttonFreteAlterar.addEventListener('click', function() {
    linkFrete.style.display = 'flex';        
        boxFreteInput.style.display = 'flex';
        contentFrete.style.display = 'none';
        boxFreteCep.style.display = 'none';
        limparInput();
});

function limparInput() {
    inputFrete.value = ''; // Limpa o campo
    mensagem.textContent = ''; // Limpa mensagens de erro
    inputFrete.focus(); // Foca no input para nova digitação
}

// Função opcional para buscar endereço via API
function buscarEndereco(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                console.log('Endereço encontrado:', data);
                // Aqui você pode preencher campos com o endereço
                // Exemplo: document.querySelector('.endereco').textContent = data.logradouro;
            } else {
                mensagem.textContent = 'CEP não encontrado.';
                mensagem.style.color = 'red'; // opcional: estilizar a mensagem
            }
        })
        .catch(error => {
            console.error('Erro ao buscar CEP:', error);
            mensagem.textContent = 'Erro ao consultar o CEP.';
            mensagem.style.color = 'red'; // opcional: estilizar a mensagem
        });
}

// Permite apenas números ao digitar (opcional)
inputFrete.addEventListener('keypress', function(e) {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    
    // Permite apenas números
    if (!/[0-9]/.test(keyValue)) {
        e.preventDefault();
    }
});

// MODAL - EXCLUIR PRODUTO
class CarrinhoCompras {
    constructor() {
        this.modal = document.getElementById('modal-confirmacao');
        this.carrinhoContainer = document.getElementById('carrinho-container');
        this.carrinhoVazio = document.getElementById('carrinho-vazio');
        this.productCartFreteSubtotal = document.getElementById('product-cart-frete-subtotal');
        this.productCartCarousel = document.getElementById('product-cart-carousel');
        this.productCartBannerResumo = document.getElementById('product-cart-banner-resumo');
        this.produtoParaExcluir = null;
        
        this.init();
    }
    
    init() {
        // Adicionar eventos para todos os botões de excluir
        this.adicionarEventosBotoesExcluir();
        
        // Eventos do modal
        document.getElementById('btn-sim').addEventListener('click', () => this.confirmarExclusao());
        document.getElementById('btn-nao').addEventListener('click', () => this.fecharModal());
        
        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.fecharModal();
            }
        });
        
        // Verificar estado inicial do carrinho
        this.verificarCarrinhoVazio();
    }
    
    adicionarEventosBotoesExcluir() {
        const botoesExcluir = document.querySelectorAll('.btn-excluir');
        botoesExcluir.forEach(botao => {
            botao.addEventListener('click', (e) => {
                e.preventDefault();
                const produtoDiv = botao.closest('.content-produto');
                if (produtoDiv) {
                    this.abrirModal(produtoDiv);
                }
            });
        });
    }
    
    abrirModal(produtoDiv) {
        this.produtoParaExcluir = produtoDiv;
        this.modal.classList.add('show');
    }
    
    fecharModal() {
        this.modal.classList.remove('show');
        this.produtoParaExcluir = null;
    }
    
    confirmarExclusao() {
        if (this.produtoParaExcluir) {
            // Adicionar animação de remoção
            this.produtoParaExcluir.style.opacity = '0';
            
            setTimeout(() => {
                // Remover o produto
                this.produtoParaExcluir.remove();
                this.produtoParaExcluir = null;
                this.fecharModal();
                
                // Verificar se o carrinho está vazio
                this.verificarCarrinhoVazio();
                
                // Reconfigurar eventos para os botões restantes
                this.adicionarEventosBotoesExcluir();
            }, 300);
        }
    }
    
    verificarCarrinhoVazio() {
        const produtos = document.querySelectorAll('.content-produto');
        
        if (produtos.length === 0) {
            this.carrinhoVazio.classList.remove('hidden');
            this.carrinhoContainer.classList.add('hidden');
            /* this.productCart.classList.add('hidden'); */
            this.productCartFreteSubtotal.style.display = 'none';
            this.productCartCarousel.style.display = 'none';
            this.productCartBannerResumo.style.display = 'none';
        } else {
            this.carrinhoVazio.classList.add('hidden');
            this.carrinhoContainer.classList.remove('hidden');
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new CarrinhoCompras();
});