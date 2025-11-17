let carrinho = [];

const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor);
};

function calcularTotal() {
    return carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
}

function atualizarContador(quantidadeTotal) {
    document.getElementById("contador-carrinho").textContent = quantidadeTotal;
}

function atualizarCarrinho() {
    const itensHTML = document.getElementById("carrinho-itens");
    const totalHTML = document.getElementById("carrinho-total");

    const totalCalculado = calcularTotal();
    const quantidadeTotal = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    atualizarContador(quantidadeTotal);
    totalHTML.textContent = formatarMoeda(totalCalculado); 

    if (carrinho.length === 0) {
        itensHTML.innerHTML = `<p class="carrinho-vazio">Seu carrinho está vazio 😢</p>`;
        const assinaturaBtn = document.querySelector('[data-nome="Assinatura Premium"]');
        if (assinaturaBtn && assinaturaBtn.disabled) {
            assinaturaBtn.textContent = "Assinar";
            assinaturaBtn.disabled = false;
        }
        return;
    }

    const itensCarrinhoHTML = carrinho.map((item, index) => {
        const isAssinatura = item.nome.includes("Assinatura Premium");
        const disabledAttr = isAssinatura ? 'disabled' : '';

        return `
            <div class="carrinho-item fadeIn">
                <div class="item-info">
                    <strong>${item.nome}</strong><br>
                    <small>${formatarMoeda(item.preco)} cada</small>
                </div>
                
                <div class="item-quantidade">
                    <button class="btn-quantidade" onclick="mudarQuantidade(${index}, -1)" ${disabledAttr}>-</button>
                    <input type="number" value="${item.quantidade}" min="1" 
                           onchange="atualizarQuantidadeDireto(${index}, this.value)"
                           ${disabledAttr}>
                    <button class="btn-quantidade" onclick="mudarQuantidade(${index}, 1)" ${disabledAttr}>+</button>
                </div>

                <button class="remover-item-btn" onclick="removerItem(${index})">
                    Remover
                </button>
            </div>
        `;
    }).join(''); 

    itensHTML.innerHTML = itensCarrinhoHTML;
}

function removerItem(index) {
    const itemRemovido = carrinho[index];
    carrinho.splice(index, 1);
    
    if (itemRemovido.nome.includes("Assinatura Premium")) {
        const assinaturaBtn = document.querySelector('[data-nome="Assinatura Premium"]');
        if (assinaturaBtn) {
            assinaturaBtn.textContent = "Assinar";
            assinaturaBtn.disabled = false;
        }
    }
    
    atualizarCarrinho();
}

function mudarQuantidade(index, mudanca) {
    if (carrinho[index].quantidade + mudanca >= 1) {
        carrinho[index].quantidade += mudanca;
    } else if (carrinho[index].quantidade + mudanca === 0) {
        removerItem(index); 
        return;
    }
    atualizarCarrinho();
}

function atualizarQuantidadeDireto(index, novoValor) {
    let quantidade = parseInt(novoValor);
    
    if (isNaN(quantidade) || quantidade < 1) {
        quantidade = 1; 
    }

    carrinho[index].quantidade = quantidade;
    atualizarCarrinho();
}


function adicionarAoCarrinho(nome, preco) {
    const IS_ASSINATURA = nome.includes("Assinatura Premium");

    if (IS_ASSINATURA) {
        const jaAssinado = carrinho.some(item => item.nome.includes("Assinatura Premium"));

        if (jaAssinado) {
            alert("A Assinatura Premium já está no seu carrinho. Limite de 1 por cliente.");
            return;
        }

        const botaoAssinatura = document.querySelector('[data-nome="Assinatura Premium"]');
        if (botaoAssinatura) {
            botaoAssinatura.textContent = "Adicionado ✅";
            botaoAssinatura.disabled = true;
        }
        
        carrinho.push({ nome, preco, quantidade: 1 });

    } else {
        const itemExistente = carrinho.find(item => item.nome === nome);
        
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({ nome, preco, quantidade: 1 }); 
        }
    }

    animacaoCarrinho();
    atualizarCarrinho();
}

function animacaoCarrinho() {
    const flutuante = document.getElementById("carrinho-flutuante");
    flutuante.classList.add("animando");
    
    setTimeout(() => {
        flutuante.classList.remove("animando");
    }, 500); 
}


document.querySelectorAll(".adicionar-carrinho").forEach(botao => {
    botao.addEventListener("click", () => {
        const nome = botao.getAttribute("data-nome");
        const preco = parseFloat(botao.getAttribute("data-preco"));

        adicionarAoCarrinho(nome, preco);
        abrirCarrinho(); 
    });
});

function abrirCarrinho() {
    document.getElementById("carrinho-lateral").classList.add("ativo");
    document.getElementById("carrinho-overlay").classList.add("ativo");
}

function fecharCarrinho() {
    document.getElementById("carrinho-lateral").classList.remove("ativo");
    document.getElementById("carrinho-overlay").classList.remove("ativo");
}


document.getElementById("carrinho-flutuante").onclick = abrirCarrinho;
document.getElementById("fechar-carrinho").onclick = fecharCarrinho;
document.getElementById("carrinho-overlay").onclick = fecharCarrinho;


document.getElementById("finalizar-compra").addEventListener("click", () => {
    const totalCompra = calcularTotal();
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Adicione alguns produtos antes de finalizar.");
        return;
    }
    alert(`Obrigado pela compra! Total: ${formatarMoeda(totalCompra)}`); 

    carrinho = [];
    atualizarCarrinho();
    fecharCarrinho();
});

atualizarCarrinho();