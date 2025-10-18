let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
  const container = document.getElementById('cart-container');
  const totalDiv = document.getElementById('cart-total');

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-cart">Your cart is empty 💔</p>`;
    totalDiv.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img src="/images/${item.image}" alt="${item.name}">
      <div class="cart-details">
        <h3>${item.name}</h3>
        <p>KES ${item.price}</p>
        <div class="quantity-control">
          <button onclick="updateQuantity(${i}, -1)">−</button>
          <span>${item.quantity || 1}</span>
          <button onclick="updateQuantity(${i}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeItem(${i})">&times;</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  totalDiv.innerHTML = `
    <h2>Total: KES ${total}</h2>
    <button class="checkout-btn">Proceed to Checkout</button>
  `;

  document.getElementById('cart-count').textContent = cart.length;
}

function updateQuantity(index, change) {
  const item = cart[index];
  item.quantity = (item.quantity || 1) + change;
  if (item.quantity < 1) item.quantity = 1;
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

window.onload = renderCart;
