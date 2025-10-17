async function loadProducts() {
  const response = await fetch('/data/products.json');
  const products = await response.json();

  const container = document.getElementById('products');
  container.innerHTML = products.map(p => `
    <div class="product">
      <img src="/images/${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>KES ${p.price}</p>
      <button>Add to Cart</button>
    </div>
  `).join('');
}

loadProducts();

let cartCount = 0;

document.addEventListener('click', (e) => {
  if (e.target.textContent === 'Add to Cart') {
    cartCount++;
    document.getElementById('cart-count').textContent = cartCount;
  }
});
