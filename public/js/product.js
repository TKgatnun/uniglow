document.addEventListener('DOMContentLoaded', () => {
  // This script runs on the product detail page
  const container = document.getElementById('product-detail-container');
  if (!container) return;

  // 1. Get product ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    container.innerHTML = '<p class="error-message">Product not found. Please return to the <a href="/shop">shop</a>.</p>';
    return;
  }

  // 2. Fetch all products and find the matching one
  fetch('/data/products.json')
    .then(response => response.json())
    .then(products => {
      const product = products.find(p => p.id == productId);

      if (!product) {
        container.innerHTML = '<p class="error-message">Product not found. Please return to the <a href="/shop">shop</a>.</p>';
        return;
      }

      // 3. Render the product details into the container
      document.title = `${product.name} – UniGlow`; // Update the page title
      container.innerHTML = `
        <div class="product-detail-image">
          <img src="/images/${product.image}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
          <h1>${product.name}</h1>
          <p class="product-price">KES ${product.price.toFixed(2)}</p>
          <p class="product-description">
            ${product.description || 'No description available.'}
          </p>
          <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">
            Add to Cart
          </button>
        </div>
      `;
    })
    .catch(error => {
      console.error('Error loading product details:', error);
      container.innerHTML = '<p class="error-message">Could not load product details. Please try again later.</p>';
    });
});