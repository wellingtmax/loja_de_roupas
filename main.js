document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let carrinho = [];
    const carrinhoIcon = document.getElementById('car_cab');
    const modal = document.createElement('div');
    modal.className = 'modal-carrinho';
    modal.style.display = 'none';
    document.body.appendChild(modal);

    // Função para atualizar o ícone do carrinho
    function atualizarCarrinhoIcon() {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        if (totalItens > 0) {
            // Cria ou atualiza o balão de contagem
            let contador = carrinhoIcon.querySelector('.contador-carrinho');
            if (!contador) {
                contador = document.createElement('span');
                contador.className = 'contador-carrinho';
                carrinhoIcon.appendChild(contador);
            }
            contador.textContent = totalItens;
        } else {
            // Remove o balão se não houver itens
            const contador = carrinhoIcon.querySelector('.contador-carrinho');
            if (contador) {
                carrinhoIcon.removeChild(contador);
            }
        }
    }

    // Função para exibir o modal do carrinho
    function exibirCarrinho() {
        if (carrinho.length === 0) {
            modal.innerHTML = '<div class="carrinho-vazio"><p>Seu carrinho está vazio</p></div>';
        } else {
            let html = '<div class="carrinho-container">';
            html += '<h2>Seu Carrinho</h2>';
            
            let total = 0;
            
            carrinho.forEach((item, index) => {
                const valorNumerico = parseFloat(item.preco.replace('R$ ', '').replace(',', '.'));
                total += valorNumerico * item.quantidade;
                
                html += `
                    <div class="item-carrinho">
                        <img src="${item.imagem}" width="80">
                        <div class="info-item">
                            <h3>${item.nome}</h3>
                            <p>${item.preco} x ${item.quantidade}</p>
                            <p class="subtotal">Subtotal: R$ ${(valorNumerico * item.quantidade).toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div class="controles-item">
                            <button class="btn-mais" data-index="${index}">+</button>
                            <span>${item.quantidade}</span>
                            <button class="btn-menos" data-index="${index}">-</button>
                            <button class="btn-remover" data-index="${index}">×</button>
                        </div>
                    </div>
                `;
            });
            
            html += `<div class="total-carrinho"><h3>Total: R$ ${total.toFixed(2).replace('.', ',')}</h3></div>`;
            html += '<div class="botoes-carrinho">';
            html += '<button class="continuar-comprando">Continuar Comprando</button>';
            html += '<button class="finalizar-compra">Finalizar Compra</button>';
            html += '</div>';
            html += '</div>';
            
            modal.innerHTML = html;
            
            // Adiciona eventos aos botões do carrinho
            document.querySelectorAll('.btn-mais').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    carrinho[index].quantidade++;
                    exibirCarrinho();
                    atualizarCarrinhoIcon();
                });
            });
            
            document.querySelectorAll('.btn-menos').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    if (carrinho[index].quantidade > 1) {
                        carrinho[index].quantidade--;
                    } else {
                        carrinho.splice(index, 1);
                    }
                    exibirCarrinho();
                    atualizarCarrinhoIcon();
                });
            });
            
            document.querySelectorAll('.btn-remover').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    carrinho.splice(index, 1);
                    exibirCarrinho();
                    atualizarCarrinhoIcon();
                });
            });
            
            document.querySelector('.continuar-comprando').addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            document.querySelector('.finalizar-compra').addEventListener('click', function() {
                alert('Compra finalizada! Obrigado por sua compra.');
                carrinho = [];
                exibirCarrinho();
                atualizarCarrinhoIcon();
                modal.style.display = 'none';
            });
        }
        
        modal.style.display = 'flex';
    }

    // Adiciona eventos aos botões de carrinho
    document.querySelectorAll('.car').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const produtoDiv = this.closest('.prod');
            const nome = produtoDiv.querySelector('p').textContent;
            const preco = produtoDiv.querySelector('#vl').textContent;
            const imagem = produtoDiv.querySelector('img').src;
            
            // Verifica se o item já está no carrinho
            const itemExistente = carrinho.find(item => item.nome === nome && item.preco === preco);
            
            if (itemExistente) {
                itemExistente.quantidade++;
            } else {
                carrinho.push({
                    nome: nome,
                    preco: preco,
                    imagem: imagem,
                    quantidade: 1
                });
            }
            
            atualizarCarrinhoIcon();
            
            // Feedback visual
            const feedback = document.createElement('div');
            feedback.className = 'feedback-adicionado';
            feedback.textContent = 'Item adicionado ao carrinho!';
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.classList.add('fade-out');
                setTimeout(() => {
                    document.body.removeChild(feedback);
                }, 500);
            }, 2000);
        });
    });

    // Adiciona evento ao ícone do carrinho no cabeçalho
    carrinhoIcon.addEventListener('click', exibirCarrinho);

    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});