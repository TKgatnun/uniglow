/**
 * Generates the HTML for a star rating display.
 * @param {number | undefined} rating - The average product rating (e.g., 4.5).
 * @param {number | undefined} reviewCount - The total number of reviews.
 * @returns {string} HTML string for the star rating.
 */
function renderRating(rating, reviewCount) {
  if (typeof rating !== 'number' || rating === 0) {
    return '<p class="no-reviews">No reviews yet</p>';
  }

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  const starsHTML =
    '★'.repeat(fullStars) +
    '½'.repeat(halfStar) +
    '☆'.repeat(emptyStars);

  return `
    <div class="star-rating" title="${rating.toFixed(1)} out of 5 stars">
      <span class="stars">${starsHTML}</span>
      <span class="review-count">(${reviewCount} reviews)</span>
    </div>
  `;
}

/**
 * Renders the product image gallery with thumbnails.
 * @param {object} product - The product object.
 * @returns {string} HTML string for the image gallery.
 */
function renderImageGallery(product) {
  const thumbnails = (product.images || [product.image]).map(img =>
    `<img src="/images/${img}" alt="Thumbnail for ${product.name}" class="thumbnail-img" onclick="changeMainImage('/images/${img}')">`
  ).join('');

  return `
    <div class="product-detail-image">
      <img id="main-product-image" src="/images/${product.image}" alt="${product.name}">
      ${(product.images && product.images.length > 1) ? `<div class="product-thumbnails">${thumbnails}</div>` : ''}
    </div>
  `;
}

/**
 * Changes the main product image when a thumbnail is clicked.
 * @param {string} newImageSrc - The src for the new main image.
 */
function changeMainImage(newImageSrc) {
  document.getElementById('main-product-image').src = newImageSrc;
}

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
        ${renderImageGallery(product)}
        <div class="product-detail-info">
          <h1>${product.name}</h1>
          ${renderRating(product.rating, product.reviews)}
          <p class="product-price">KES ${product.price.toFixed(2)}</p>
          <p class="product-description">
            ${product.description || 'No description available.'}
          </p>
          <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">
            Add to Cart
          </button>
        </div>
      `;

      // 4. Load and render related products
      loadRelatedProducts(products, product.category, product.id);
    })
    .catch(error => {
      console.error('Error loading product details:', error);
      container.innerHTML = '<p class="error-message">Could not load product details. Please try again later.</p>';
    });
});

function loadRelatedProducts(allProducts, category, currentProductId) {
  const relatedContainer = document.getElementById('related-products-container');
  if (!relatedContainer) return;

  const related = allProducts.filter(p => p.category === category && p.id !== currentProductId).slice(0, 4); // Show up to 4

  // We can reuse the renderProducts function from script.js if it's available globally
  // For simplicity here, we'll just render them directly.
  if (related.length > 0) {
    relatedContainer.innerHTML = related.map(p => `
      <div class="product">
        <a href="/product.html?id=${p.id}" class="product-link" aria-label="View details for ${p.name}">
          <img src="/images/${p.image}" alt="${p.name}" loading="lazy">
          <h3>${p.name}</h3>
          <p>KES ${p.price}</p>
        </a>
        <button onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>
      </div>
    `).join('');
  } else {
    relatedContainer.innerHTML = '<p>No related products found.</p>';
  }
}