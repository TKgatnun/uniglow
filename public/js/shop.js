document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products');
  const searchBar = document.getElementById('search-bar');
  const categoryFilter = document.getElementById('category-filter');

  let allProducts = []; // To store all products fetched

  // Fetch products from the JSON file
  fetch('/data/products.json')
    .then(response => response.json())
    .then(products => {
      allProducts = products;
      populateCategories(products);
      renderProducts(products);
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      productsContainer.innerHTML = '<p class="error-message">Could not load products. Please try again later.</p>';
    });

  /**
   * Renders product cards into the container.
   * @param {Array} products - An array of product objects to render.
   */
  function renderProducts(products) {
    if (!products.length) {
      productsContainer.innerHTML = '<p class="no-results">No products found matching your criteria. ✨</p>';
      return;
    }

    productsContainer.innerHTML = products.map(product => `
      <div class="product">
        <a href="/product.html?id=${product.id}" class="product-link" aria-label="View details for ${product.name}">
          <img src="/images/${product.image}" alt="${product.name}" loading="lazy">
          <h3>${product.name}</h3>
          <p>KES ${product.price.toFixed(2)}</p>
        </a>
        <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
      </div>
    `).join('');
  }

  /**
   * Populates the category filter dropdown with unique categories.
   * @param {Array} products - An array of all product objects.
   */
  function populateCategories(products) {
    const categories = [...new Set(products.map(p => p.category))];
    categories.sort().forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  /**
   * Filters products based on search term and selected category.
   */
  function filterProducts() {
    const searchTerm = searchBar.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    let filteredProducts = allProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    renderProducts(filteredProducts);
  }

  // Add event listeners for the filter controls
  searchBar.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
});