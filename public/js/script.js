let allProducts = []; // To store the master list of products

async function loadProducts() {
  const response = await fetch('/data/products.json');
  allProducts = await response.json();
  renderProducts(allProducts); // Initial render of all products
}

function renderProducts(productsToRender) {
  const container = document.getElementById('products');
  if (!container) return;

  if (productsToRender.length === 0) {
    container.innerHTML = '<p class="no-results">No products match your search.</p>';
    return;
  }

  container.innerHTML = productsToRender.map(p => `
    <div class="product">
      <a href="/product.html?id=${p.id}" class="product-link" aria-label="View details for ${p.name}">
        <img src="/images/${p.image}" alt="${p.name}" loading="lazy">
        <h3>${p.name}</h3>
        <p>KES ${p.price}</p>
      </a>
      <button onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>
    </div>
  `).join('');
}

loadProducts();

function applyFiltersAndSort() {
  let filteredProducts = [...allProducts];
  const searchTerm = document.getElementById('search-bar').value.toLowerCase();
  const sortValue = document.getElementById('sort-select').value;

  // Apply search filter
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
  }

  // Apply sort
  switch (sortValue) {
    case 'price-asc': filteredProducts.sort((a, b) => a.price - b.price); break;
    case 'price-desc': filteredProducts.sort((a, b) => b.price - a.price); break;
    case 'name-asc': filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'name-desc': filteredProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
  }

  renderProducts(filteredProducts);
}

let cart = [];

// Helper to dispatch a custom event when the cart changes
function dispatchCartUpdateEvent() {
  document.dispatchEvent(new CustomEvent('cartUpdated'));
}

function addToCart(id, name, price, image) {
  // Find if the product is already in the cart
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    // If it exists, just increase the quantity
    existingItem.quantity++;
  } else {
    // If not, add it to the cart with quantity 1
    const product = { id, name, price, image, quantity: 1 };
    cart.push(product);
  }

  updateCartCount();
  saveCart();
  dispatchCartUpdateEvent(); // Notify other parts of the app that cart has changed
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = totalItems;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

window.onload = () => {
  const savedCart = JSON.parse(localStorage.getItem('cart'));
  if (savedCart) {
    cart = savedCart;
    updateCartCount();
    dispatchCartUpdateEvent(); // Notify other components to render with the loaded cart
  }
};

function renderCartDropdown() {
  const dropdown = document.getElementById('cart-items-list');
  if (!dropdown) return; // defensive: DOM might not include the dropdown on some pages

  if (!cart || cart.length === 0) {
    dropdown.innerHTML = '<li class="empty">Your cart is empty</li>';
    return;
  }

  dropdown.innerHTML = cart.map((item, index) => `
    <li>
      <img src="/images/${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <strong>${item.name}</strong><br>
        <small>${item.quantity} &times; KES ${item.price.toFixed(2)}</small>
      </div>
      <button class="remove-item" data-index="${index}" aria-label="Remove ${item.name}">&times;</button>
    </li>
  `).join('');
}

// Remove an item by index (re-renders dropdown and updates storage/count)
function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  dispatchCartUpdateEvent(); // Notify other parts of the app that cart has changed
}

// Event delegation for remove buttons inside the dropdown
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('remove-item')) {
    const idx = parseInt(e.target.getAttribute('data-index'), 10);
    removeFromCart(idx);
  }
});

// Re-render dropdown whenever cart is updated
document.addEventListener('cartUpdated', renderCartDropdown);

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

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');

function enableDarkMode() {
  document.body.classList.add('dark-mode');
  localStorage.setItem('darkMode', 'enabled');
  if (darkModeToggle) {
    darkModeToggle.textContent = 'Light Mode'; // Update button text
  }
}

function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  localStorage.setItem('darkMode', 'disabled');
  if (darkModeToggle) {
    darkModeToggle.textContent = 'Dark Mode'; // Update button text
  }
}

// Check for saved preference on load
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
  } else {
    disableDarkMode(); // Ensure button text is correct if no preference or disabled
  }

  // Event listener for the toggle button
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
      } else {
        enableDarkMode();
      }
    });
  }

  // Event listeners for search and sort
  const searchBar = document.getElementById('search-bar');
  const sortSelect = document.getElementById('sort-select');
  if (searchBar) searchBar.addEventListener('input', applyFiltersAndSort);
  if (sortSelect) sortSelect.addEventListener('change', applyFiltersAndSort);
});

// Hamburger Menu Toggle (can be outside DOMContentLoaded as it's at the end of body)
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}
