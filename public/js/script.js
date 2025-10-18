async function loadProducts() {
  const response = await fetch('/data/products.json');
  const products = await response.json();

  const container = document.getElementById('products');
  container.innerHTML = products.map(p => `
    <div class="product">
      <img src="/images/${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>KES ${p.price}</p>
      <button onclick="addToCart('${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>

    </div>
  `).join('');
}

loadProducts();

/*let cartCount = 0;

document.addEventListener('click', (e) => {
  if (e.target.textContent === 'Add to Cart') {
    cartCount++;
    document.getElementById('cart-count').textContent = cartCount;
  }
});
*/

let cart = [];

function addToCart(name, price, image) {
  const product = { name, price, image };
  cart.push(product);
  updateCartCount();
  saveCart();
  renderCartDropdown();
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.length;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

window.onload = () => {
  const savedCart = JSON.parse(localStorage.getItem('cart'));
  if (savedCart) {
    cart = savedCart;
    updateCartCount();
  }
  // Render the dropdown so saved items are visible on hover
  renderCartDropdown();
};

function renderCartDropdown() {
  const dropdown = document.getElementById('cart-items-list');
  if (!dropdown) return; // defensive: DOM might not include the dropdown on some pages

  if (!cart || cart.length === 0) {
    dropdown.innerHTML = '<li class="empty">Your cart is empty</li>';
    return;
  }

  dropdown.innerHTML = cart.map(item => `
    <li>
      <img src="/images/${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <strong>${item.name}</strong><br>
        <small>KES ${item.price}</small>
      </div>
      <button class="remove-item" data-index="${cart.indexOf(item)}" aria-label="Remove ${item.name}">&times;</button>
    </li>
  `).join('');
}

// Remove an item by index (re-renders dropdown and updates storage/count)
function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  renderCartDropdown();
}

// Event delegation for remove buttons inside the dropdown
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('remove-item')) {
    const idx = parseInt(e.target.getAttribute('data-index'), 10);
    removeFromCart(idx);
  }
});

// Toggle cart dropdown on click (use .open class so mobile can reuse logic)
const cartEl = document.querySelector('.cart');
if (cartEl) {
  cartEl.addEventListener('click', (e) => {
    // Avoid triggering remove button when clicking it
    if (e.target.closest('.remove-item')) return;
    cartEl.classList.toggle('open');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!cartEl.contains(e.target)) {
      cartEl.classList.remove('open');
    }
  });

  // Close when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cartEl.classList.remove('open');
  });
}
