const btnFiltro = document.querySelector('.btn-filtro');
const filtro = document.querySelector('.filtro');

btnFiltro.addEventListener('click', function() {
    filtro.classList.toggle('ativo');
    btnFiltro.classList.toggle('ativo');
});

// Função principal do filtro
function inicializarFiltroProdutos() {
    // Selecionar todos os produtos
    const produtos = document.querySelectorAll('.product-card');
    
    // Selecionar todos os inputs de rádio dos filtros
    const radiosCategoria = document.querySelectorAll('input[name="categoria"]');
    const radiosSabor = document.querySelectorAll('input[name="sabor"]');
    const radiosQuantidade = document.querySelectorAll('input[name="quantidade"]');
    const radioTodos = document.querySelector('input[name="todos"]');
    
    // Criar elemento para mensagem de nenhum produto encontrado
    const containerProdutos = document.querySelector('.favorito .produtos');
    let mensagemNenhumProduto = null;
    
    function criarMensagemNenhumProduto() {
        if (!mensagemNenhumProduto) {
            mensagemNenhumProduto = document.createElement('div');
            mensagemNenhumProduto.className = 'nenhum-produto-mensagem';
            mensagemNenhumProduto.style.textAlign = 'center';
            mensagemNenhumProduto.style.padding = '50px 20px';
            mensagemNenhumProduto.style.backgroundColor = '#f8f9fa';
            mensagemNenhumProduto.style.borderRadius = '8px';
            mensagemNenhumProduto.style.margin = '20px 0';
            mensagemNenhumProduto.innerHTML = `
                <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 15px; display: block;"></i>
                <h3 style="color: #666; margin-bottom: 10px;">Nenhum produto encontrado</h3>
                <p style="color: #999;">Não há produtos com os filtros selecionados. Tente outras opções.</p>
            `;
        }
        return mensagemNenhumProduto;
    }
    
    // Função para obter o valor selecionado de um grupo de rádios
    function getSelectedValue(radios) {
        let selectedValue = null;
        radios.forEach(radio => {
            if (radio.checked) {
                selectedValue = radio.value;
            }
        });
        return selectedValue;
    }
    
    // Função para verificar se há produtos visíveis
    function verificarProdutosVisiveis() {
        let produtosVisiveis = 0;
        produtos.forEach(produto => {
            if (produto.style.display !== 'none') {
                produtosVisiveis++;
            }
        });
        
        const mensagemDiv = criarMensagemNenhumProduto();
        
        if (produtosVisiveis === 0 && containerProdutos) {
            // Se não há produtos visíveis e a mensagem não está no container, adicionar
            if (!containerProdutos.querySelector('.nenhum-produto-mensagem')) {
                containerProdutos.appendChild(mensagemDiv);
            }
        } else {
            // Se há produtos visíveis, remover a mensagem se existir
            if (mensagemDiv && mensagemDiv.parentNode) {
                mensagemDiv.remove();
            }
        }
    }
    
    // Função principal de filtro
    function filtrarProdutos() {
        const categoriaSelecionada = getSelectedValue(radiosCategoria);
        const saborSelecionado = getSelectedValue(radiosSabor);
        const quantidadeSelecionada = getSelectedValue(radiosQuantidade);
        
        // Se nenhum filtro estiver selecionado, mostrar todos os produtos
        if (!categoriaSelecionada && !saborSelecionado && !quantidadeSelecionada) {
            produtos.forEach(produto => {
                produto.style.display = '';
            });
            verificarProdutosVisiveis();
            return;
        }
        
        // Filtrar produtos
        produtos.forEach(produto => {
            let mostrar = true;
            
            // Verificar categoria
            if (categoriaSelecionada) {
                const categoriaProduto = produto.querySelector('input[name="categoria"]').value;
                if (categoriaProduto !== categoriaSelecionada) {
                    mostrar = false;
                }
            }
            
            // Verificar sabor
            if (mostrar && saborSelecionado) {
                const saborProduto = produto.querySelector('input[name="sabor"]').value;
                if (saborProduto !== saborSelecionado) {
                    mostrar = false;
                }
            }
            
            // Verificar quantidade
            if (mostrar && quantidadeSelecionada) {
                const quantidadeProduto = produto.querySelector('input[name="quantidade"]').value;
                if (quantidadeProduto !== quantidadeSelecionada) {
                    mostrar = false;
                }
            }
            
            // Aplicar ou ocultar o produto
            produto.style.display = mostrar ? '' : 'none';
        });
        
        // Verificar se há produtos visíveis após o filtro
        verificarProdutosVisiveis();
    }
    
    // Função para resetar todos os filtros
    function resetarFiltros() {
        // Desmarcar todos os rádios de filtro
        const allRadios = document.querySelectorAll('input[name="categoria"], input[name="sabor"], input[name="quantidade"]');
        allRadios.forEach(radio => {
            radio.checked = false;
        });
        
        // Mostrar todos os produtos
        produtos.forEach(produto => {
            produto.style.display = '';
        });
        
        // Verificar produtos visíveis
        verificarProdutosVisiveis();
    }
    
    // Adicionar eventos para os rádios de filtro
    function adicionarEventosFiltro() {
        const todosRadiosFiltro = [
            ...radiosCategoria,
            ...radiosSabor,
            ...radiosQuantidade
        ];
        
        todosRadiosFiltro.forEach(radio => {
            radio.addEventListener('change', function() {
                // Se algum filtro for selecionado, desmarcar o "Todos" se estiver marcado
                if (radioTodos && radioTodos.checked && this.checked) {
                    radioTodos.checked = false;
                }
                filtrarProdutos();
            });
        });
    }
    
    // Adicionar evento para o botão "Todos"
    function adicionarEventoTodos() {
        if (radioTodos) {
            radioTodos.addEventListener('change', function() {
                if (this.checked) {
                    resetarFiltros();
                }
            });
        }
    }
    
    // Adicionar estilos para a mensagem responsiva
    function adicionarEstilosMensagem() {
        const style = document.createElement('style');
        style.textContent = `
            .nenhum-produto-mensagem {
                text-align: center;
                padding: 50px 20px;
                background-color: #f8f9fa;
                border-radius: 8px;
                margin: 20px 0;
                animation: fadeIn 0.5s ease;
                width:100%;
            }
            
            .nenhum-produto-mensagem i {
                font-size: 48px;
                color: #ccc;
                margin-bottom: 15px;
                display: block;
            }
            
            .nenhum-produto-mensagem h3 {
                color: #666;
                margin-bottom: 10px;
                font-size: 1.2rem;
            }
            
            .nenhum-produto-mensagem p {
                color: #999;
                font-size: 0.9rem;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Inicializar todas as funcionalidades
    adicionarEstilosMensagem();
    adicionarEventosFiltro();
    adicionarEventoTodos();
    inicializarToggleFiltro();
    
    // Verificar produtos visíveis inicialmente
    verificarProdutosVisiveis();
}

// Executar quando o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarFiltroProdutos();
});