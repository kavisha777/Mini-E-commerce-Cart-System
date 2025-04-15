const productList = document.getElementById('product-list');
const cartElement = document.getElementById('cart');
const totalCostElement = document.getElementById('total-cost');

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

async function fetchProducts() {
  const res = await fetch('https://fakestoreapi.com/products');
  products = await res.json();
  renderProducts();
}

function renderProducts() {
  productList.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded shadow';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="h-40 mx-auto mb-2">
      <h3 class="text-md font-bold">${product.title}</h3>
      <p class="text-gray-600">Category: ${product.category}</p>
      <p class="font-bold">$${product.price}</p>
      <button onclick="addToCart(${product.id})" class="mt-2 bg-blue-500 text-white px-4 py-1 rounded">Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const index = cart.findIndex(item => item.id === id);

  if (index > -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
}

function updateQuantity(id, change) {
  const index = cart.findIndex(item => item.id === id);
  if (index > -1) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
    renderCart();
  }
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  cartElement.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow flex justify-between items-center';
    div.innerHTML = `
      <div>
        <h4 class="font-bold">${item.title}</h4>
        <p>$${item.price} x ${item.quantity}</p>
        <div class="flex space-x-2 mt-2">
          <button onclick="updateQuantity(${item.id}, -1)" class="bg-red-500 text-white px-2 py-1 rounded">-</button>
          <button onclick="updateQuantity(${item.id}, 1)" class="bg-green-500 text-white px-2 py-1 rounded">+</button>
        </div>
      </div>
      <button onclick="removeItem(${item.id})" class="text-red-500">Remove</button>
    `;
    cartElement.appendChild(div);
    total += item.price * item.quantity;
  });
  totalCostElement.textContent = total.toFixed(2);
}

fetchProducts();
renderCart();