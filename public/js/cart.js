// This script runs on the cart.html page

// Function to render the cart items on the cart page
function renderCartPage() {
  const cartContainer = document.getElementById('cart-container');
  const cartTotalEl = document.getElementById('cart-total');

  if (!cartContainer || !cartTotalEl) {
    // These elements should exist on cart.html. If not, it's an error in the HTML.
    console.error('Cart container or total element not found on cart page.');
    return;
  }

  if (!cart || cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty. Go to <a href="/shop">Shop</a> to add items!</p>';
    cartTotalEl.innerHTML = '';
    return;
  }

  let total = 0;
  cartContainer.innerHTML = cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="cart-item">
        <img src="/images/${item.image}" alt="${item.name}">
        <div class="cart-details">
          <h3>${item.name}</h3>
          <p>KES ${item.price.toFixed(2)}</p>
          <div class="quantity-control">
            <button data-index="${index}" data-delta="-1" class="quantity-btn">-</button>
            <span>${item.quantity}</span>
            <button data-index="${index}" data-delta="1" class="quantity-btn">+</button>
          </div>
        </div>
        <div class="cart-item-price">
          KES ${itemTotal.toFixed(2)}
        </div>
        <button class="remove-item-page" data-index="${index}" aria-label="Remove ${item.name}">&times;</button>
      </div>
    `;
  }).join('');

  cartTotalEl.innerHTML = `
    <p><strong>Total:</strong> KES ${total.toFixed(2)}</p>
    <button class="checkout-btn">Proceed to Checkout</button>
  `;

  // Add event listeners for quantity changes
  cartContainer.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      const delta = parseInt(e.target.dataset.delta);
      changeQuantity(index, delta);
    });
  });

  // Add event listeners for item removal (using a different class to avoid conflict with dropdown)
  cartContainer.querySelectorAll('.remove-item-page').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      // Call the global removeFromCart from script.js
      removeFromCart(index);
      // The 'cartUpdated' event will trigger renderCartPage again
    });
  });

  // Add event listener for checkout button
  const checkoutBtn = cartTotalEl.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      window.location.href = '/checkout'; // Redirect to checkout page
    });
  }
}

// Function to handle quantity changes
function changeQuantity(index, delta) {
  if (index < 0 || index >= cart.length) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    // If quantity drops to 0 or less, remove the item
    removeFromCart(index);
  } else {
    saveCart(); // Save changes to localStorage
    // The 'cartUpdated' event will trigger updateCartCount via script.js
    // Dispatch event to re-render the cart page and dropdown if needed
    document.dispatchEvent(new CustomEvent('cartUpdated'));
  }
}

// Listen for cart updates from script.js or local changes
// This ensures the cart page updates if items are added/removed from other pages
// (e.g., via the dropdown) while the cart page is open.
document.addEventListener('cartUpdated', renderCartPage);

// Initial render when the cart page loads
document.addEventListener('DOMContentLoaded', () => {
  // The 'cart' array should be populated by script.js's window.onload
  // before this DOMContentLoaded listener fires, as script.js is loaded first.
  renderCartPage();
});