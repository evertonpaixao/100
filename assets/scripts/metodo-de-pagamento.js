document.querySelector('.add-address').addEventListener('click', function () {
    document.getElementById('address-form').classList.add('visible');
});

document.addEventListener("DOMContentLoaded", function () {
    const radios = document.querySelectorAll('input[name="pagamento"]');
    const formCartao = document.getElementById("form-cadastro-cartao");

    function toggleForm() {
        const selected = document.querySelector('input[name="pagamento"]:checked');
        formCartao.style.display = selected && selected.value === "cartao" ? "block" : "none";
    }

    radios.forEach(radio => {
        radio.addEventListener("change", toggleForm);
    });

    toggleForm(); // roda ao carregar
});

document.addEventListener('DOMContentLoaded', function() {

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

document.addEventListener('DOMContentLoaded', function() {
    
  const numeroInput = document.getElementById('numero');
  const validadeInput = document.getElementById('validade');
  const cvvInput = document.getElementById('cvv');
  const bandeiraImg = document.getElementById('bandeira-img');
  
  // Objeto com as imagens das bandeiras
  const bandeiras = {
    visa: 'assets/images/bandeiras-cartoes/visa.jpg',
    mastercard: 'assets/images/bandeiras-cartoes/mastercard.jpg',
    amex: 'assets/images/bandeiras-cartoes/amex.jpg',
    elo: 'assets/images/bandeiras-cartoes/elo.jpg',
    hipercard: 'assets/images/bandeiras-cartoes/hipercard.jpg',
    diners: 'assets/images/bandeiras-cartoes/diners.jpg',
    discover: 'assets/images/bandeiras-cartoes/discover.jpg',
    jcb: 'assets/images/bandeiras-cartoes/jcb.jpg',
    aura: 'assets/images/bandeiras-cartoes/aura.jpg'
  };

  // Função para detectar a bandeira do cartão
  function detectarBandeira(numero) {
    const numeroLimpo = numero.replace(/\s+/g, '');
    
    const padroes = [
      { bandeira: 'visa', padrao: /^4/ },
      { bandeira: 'mastercard', padrao: /^5[1-5]|^2[2-7]/ },
      { bandeira: 'amex', padrao: /^3[47]/ },
      { bandeira: 'elo', padrao: /^(4011|4312|4389|4514|4576|5041|5066|5067|5090|5091|5092|5093|5094|5095|5096|5097|5098|5099|6363|6364|6504|6505|6506|6507|6508|6509|6510|6511|6512|6513|6514|6515|6516)/ },
      { bandeira: 'hipercard', padrao: /^(38|60)/ },
      { bandeira: 'diners', padrao: /^3(0[0-5]|[68])/ },
      { bandeira: 'discover', padrao: /^(6011|65|64[4-9]|622)/ },
      { bandeira: 'jcb', padrao: /^35/ },
      { bandeira: 'aura', padrao: /^50/ }
    ];

    for (let item of padroes) {
      if (item.padrao.test(numeroLimpo)) {
        return item.bandeira;
      }
    }
    
    return null;
  }

  // Função para aplicar máscara no número do cartão
  function aplicarMascaraCartao(numero) {
    let numeroLimpo = numero.replace(/\D/g, '');
    let numeroMascarado = '';
    
    for (let i = 0; i < numeroLimpo.length; i++) {
      if (i > 0 && i % 4 === 0) {
        numeroMascarado += ' ';
      }
      numeroMascarado += numeroLimpo[i];
    }
    
    return numeroMascarado;
  }

  // Função para aplicar máscara na validade (MM/AA)
  function aplicarMascaraValidade(valor) {
    let valorLimpo = valor.replace(/\D/g, '');
    if (valorLimpo.length > 4) {
      valorLimpo = valorLimpo.slice(0, 4);
    }
    
    let valorMascarado = '';
    for (let i = 0; i < valorLimpo.length; i++) {
      if (i === 2) {
        valorMascarado += '/';
      }
      valorMascarado += valorLimpo[i];
    }
    
    return valorMascarado;
  }

  // Função para validar a data de validade
  function validarValidade(valor) {
    const partes = valor.split('/');
    if (partes.length !== 2) return false;
    
    const mes = parseInt(partes[0], 10);
    const ano = parseInt(partes[1], 10);
    
    if (isNaN(mes) || mes < 1 || mes > 12) return false;
    if (isNaN(ano) || ano < 0 || ano > 99) return false;
    
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth() + 1;
    const anoAtual = dataAtual.getFullYear() % 100;
    
    if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
      return false;
    }
    
    return true;
  }

  // Função para validar CVV
  function validarCVV(valor) {
    const cvvLimpo = valor.replace(/\D/g, '');
    return cvvLimpo.length >= 3 && cvvLimpo.length <= 4;
  }

  // Função para validar o número do cartão (Algoritmo de Luhn)
  function validarCartao(numero) {
    const numeroLimpo = numero.replace(/\s/g, '');
    let soma = 0;
    let alternar = false;
    
    for (let i = numeroLimpo.length - 1; i >= 0; i--) {
      let n = parseInt(numeroLimpo.charAt(i));
      
      if (alternar) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      
      soma += n;
      alternar = !alternar;
    }
    
    return (soma % 10 === 0);
  }

  // Evento de input no campo do cartão
  numeroInput.addEventListener('input', function(e) {
    let valor = e.target.value;
    
    let valorMascarado = aplicarMascaraCartao(valor);
    e.target.value = valorMascarado;
    
    const numeroLimpo = valorMascarado.replace(/\s/g, '');
    const bandeira = detectarBandeira(numeroLimpo);
    
    if (bandeira && bandeiras[bandeira]) {
      bandeiraImg.src = bandeiras[bandeira];
      bandeiraImg.alt = bandeira.charAt(0).toUpperCase() + bandeira.slice(1);
      bandeiraImg.classList.add('visible');
    } else {
      bandeiraImg.src = '';
      bandeiraImg.alt = '';
      bandeiraImg.classList.remove('visible');
    }
    
    const errorElement = document.getElementById('numero-error');
    
    if (numeroLimpo.length >= 13) {
      if (validarCartao(numeroLimpo)) {
        e.target.classList.remove('error');
        errorElement.textContent = '';
      } else {
        e.target.classList.add('error');
        errorElement.textContent = 'Número de cartão inválido';
      }
    } else {
      e.target.classList.remove('error');
      errorElement.textContent = '';
    }
  });

  // Evento de input no campo de validade
  validadeInput.addEventListener('input', function(e) {
    let valor = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    let valorMascarado = aplicarMascaraValidade(valor);
    e.target.value = valorMascarado;
    
    if (valor.length > valorMascarado.length) {
      e.target.setSelectionRange(cursorPos - 1, cursorPos - 1);
    }
    
    const errorElement = document.getElementById('validade-error');
    
    if (valorMascarado.length === 5) {
      if (validarValidade(valorMascarado)) {
        e.target.classList.remove('error');
        errorElement.textContent = '';
      } else {
        e.target.classList.add('error');
        errorElement.textContent = 'Data de validade inválida';
      }
    } else {
      e.target.classList.remove('error');
      errorElement.textContent = '';
    }
  });

  // Evento de input no campo CVV
  cvvInput.addEventListener('input', function(e) {
    let valor = e.target.value;
    let valorLimpo = valor.replace(/\D/g, '');
    
    if (valorLimpo.length > 4) {
      valorLimpo = valorLimpo.slice(0, 4);
    }
    
    e.target.value = valorLimpo;
    
    const errorElement = document.getElementById('cvv-error');
    
    if (valorLimpo.length > 0) {
      if (validarCVV(valorLimpo)) {
        e.target.classList.remove('error');
        errorElement.textContent = '';
      } else {
        e.target.classList.add('error');
        errorElement.textContent = 'CVV deve ter 3 ou 4 dígitos';
      }
    } else {
      e.target.classList.remove('error');
      errorElement.textContent = '';
    }
  });

  // Evento de blur no campo do cartão
  numeroInput.addEventListener('blur', function(e) {
    const valor = e.target.value.replace(/\s/g, '');
    const errorElement = document.getElementById('numero-error');
    
    if (valor.length > 0 && valor.length < 13) {
      e.target.classList.add('error');
      errorElement.textContent = 'Número de cartão muito curto';
    }
  });

  // Evento de blur no campo de validade
  validadeInput.addEventListener('blur', function(e) {
    const valor = e.target.value;
    const errorElement = document.getElementById('validade-error');
    
    if (valor.length > 0 && valor.length < 5) {
      e.target.classList.add('error');
      errorElement.textContent = 'Formato inválido (MM/AA)';
    }
  });

  // Evento de blur no campo CVV
  cvvInput.addEventListener('blur', function(e) {
    const valor = e.target.value;
    const errorElement = document.getElementById('cvv-error');
    
    if (valor.length > 0 && !validarCVV(valor)) {
      e.target.classList.add('error');
      errorElement.textContent = 'CVV deve ter 3 ou 4 dígitos';
    }
  });

  // Função para alternar entre cards e formulário
  const addCardButton = document.querySelector('.add-card');
  const cards = document.getElementById('cards');
  const cardForm = document.getElementById('card-form');
  const cancelButton = document.querySelector('.cancel-btn');

  if (addCardButton) {
    addCardButton.addEventListener('click', function() {
      cards.classList.add('hidden');
      cardForm.classList.add('visible');
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', function() {
      cards.classList.remove('hidden');
      cardForm.classList.remove('visible');
      
      // Limpa o formulário quando cancelar
      document.getElementById('form-cadastro-cartao').reset();
      bandeiraImg.src = '';
      bandeiraImg.classList.remove('visible');
      
      // Remove classes de erro
      document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
      });
      
      // Limpa mensagens de erro
      document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
      });
    });
  }

  // Evento de submit do formulário
  document.getElementById('form-cadastro-cartao').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const numero = document.getElementById('numero').value.replace(/\s/g, '');
    const validade = document.getElementById('validade').value;
    const cvv = document.getElementById('cvv').value;
    
    // Valida todos os campos
    let valido = true;
    let mensagemErro = '';
    
    if (!validarCartao(numero)) {
      document.getElementById('numero').classList.add('error');
      document.getElementById('numero-error').textContent = 'Número de cartão inválido';
      valido = false;
      mensagemErro = 'Número de cartão inválido';
    }
    
    if (!validarValidade(validade)) {
      document.getElementById('validade').classList.add('error');
      document.getElementById('validade-error').textContent = 'Data de validade inválida';
      valido = false;
      mensagemErro = 'Data de validade inválida';
    }
    
    if (!validarCVV(cvv)) {
      document.getElementById('cvv').classList.add('error');
      document.getElementById('cvv-error').textContent = 'CVV inválido';
      valido = false;
      mensagemErro = 'CVV inválido';
    }
    
    if (!valido) {
      mostrarModalErro(mensagemErro);
      return;
    }
    
    // Se tudo estiver válido, mostra modal de sucesso
    mostrarModalSucesso();
    
    // Aqui você pode adicionar a lógica para salvar o cartão
    console.log('Cartão salvo:', {
      numero: numero,
      validade: validade,
      cvv: cvv
    });
    
    // Volta para a tela de cards após um pequeno delay
    setTimeout(() => {
      cards.classList.remove('hidden');
      cardForm.classList.remove('visible');
      
      // Limpa o formulário
      this.reset();
      bandeiraImg.src = '';
      bandeiraImg.classList.remove('visible');
      
      // Remove classes de erro
      document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
      });
      
      // Limpa mensagens de erro
      document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
      });
    }, 20000); // 20 segundos de delay para mostrar o modal
  });
});