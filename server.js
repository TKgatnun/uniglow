const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve cart page from views folder
app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

// Support clean URLs (no .html) for common pages
app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'feedback.html'));
});

app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'shop.html'));
});

app.get('/product.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'product.html'));
});

app.get('/checkout.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'checkout.html'));
});

app.get('/checkout', (req, res) => {
  res.redirect('/checkout.html');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
