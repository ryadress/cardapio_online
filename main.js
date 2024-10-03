const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemContainer = document.getElementById("cart-item");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const adressWarn = document.getElementById("adress-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
  updateCartModal();
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// Evento para adicionar item ao carrinho
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price); // Chama a função para adicionar ao carrinho
  }
});

// Função para adicionar ao carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updateCartModal();
}

// Função para remover item do carrinho
function removeFromCart(name) {
  const existingItemIndex = cart.findIndex((item) => item.name === name);

  if (existingItemIndex > -1) {
    cart.splice(existingItemIndex, 1); // Remove o item do carrinho
  }
  updateCartModal();
}

// Função para atualizar o modal do carrinho
function updateCartModal() {
  cartItemContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-btn" data-name="${item.name}">Remover</button>
        </div>
        `;

    cartItemContainer.appendChild(cartItemElement);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCounter.textContent = cart.length;

  // Adicionando evento para o botão de remover
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const name = this.getAttribute("data-name");
      removeFromCart(name);
    });
  });
}

// Função para enviar pedido via WhatsApp
function sendOrderToWhatsApp() {
  if (!addressInput.value) {
    adressWarn.textContent = "Por favor, insira seu endereço.";
    return;
  }

  let message = "Pedido:\n";
  cart.forEach((item) => {
    message += `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
  });
  message += `\nTotal: R$ ${cartTotal.textContent}`;
  message += `\nEndereço: ${addressInput.value}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://api.whatsapp.com/send?phone=5553991733432&text=${encodedMessage}`;
  window.open(whatsappURL, "_blank");
}

// Adicionando evento ao botão de checkout
checkoutBtn.addEventListener("click", sendOrderToWhatsApp);
