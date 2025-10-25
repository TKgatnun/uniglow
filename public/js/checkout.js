// /js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
  const summaryContainer = document.getElementById("summary-items");
  const summaryTotal = document.getElementById("summary-total");
  const confirmBtn = document.getElementById("confirm-order-btn");

  // Fetch cart data
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Render order summary
  function renderSummary() {
    summaryContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      summaryContainer.innerHTML = `<p>Your cart is empty.</p>`;
      summaryTotal.innerHTML = "";
      confirmBtn.disabled = true;
      return;
    }

    cart.forEach(item => {
        const qty = item.quantity || 1;
        const subtotal = item.price * qty;
      total += subtotal;

      const div = document.createElement("div");
      div.classList.add("summary-item");
      div.innerHTML = `
        <div class="summary-item-details">
            <img src="/images/${item.image}" alt="${item.name}">
          <div>
            <h4>${item.name}</h4>
              <p>${qty} × KSh ${item.price.toLocaleString()}</p>
          </div>
        </div>
        <span class="subtotal">KSh ${subtotal.toLocaleString()}</span>
      `;
      summaryContainer.appendChild(div);
    });

    summaryTotal.innerHTML = `
      <h3>Total: <span>KSh ${total.toLocaleString()}</span></h3>
    `;
  }

  // Confirm order
  confirmBtn.addEventListener("click", () => {
    const name = document.getElementById("fullname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = document.querySelector('input[name="payment"]:checked')?.value;

    if (!name || !phone || !address) {
      alert("Please fill in all address details.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Simulate order confirmation
    alert(`✅ Order confirmed!\n\nThank you, ${name}!\nPayment Method: ${payment.toUpperCase()}`);

    // Clear cart after confirmation
    localStorage.removeItem("cart");
    window.location.href = "/";
  });

  renderSummary();
});
