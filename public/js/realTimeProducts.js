const socket = io(); // Connect to the socket server

// Get the product list container
const productList = document.querySelector('.product-list');

// Function to render a product card
function renderProductCard(product) {
  const productCard = document.createElement('div');
  productCard.classList.add('product-card', 'products-container');
  productCard.innerHTML = `
    <h3>${product.title}</h3>
    <hr />
    <p>Id: ${product._id}</p>
    <p class="product-description">Descripción: ${product.description}</p>
    <p class="product-price"> Precio: $${product.price}</p>
    <p>Stock: ${product.stock}</p>
    <p>Codigo: ${product.code}</p>
    <p>Categoria: ${product.category}</p>
    <p>Imagen: ${product.thumbnails}</p>
    <button type="button" class="add-to-cart" data-product-id="${product._id}">
      Agregar (1)
    </button>
  `;
  return productCard;
}

// Function to update the product list
function updateProductList(products) {
  productList.innerHTML = ''; // Clear existing products

  products.forEach(product => {
    const productCard = renderProductCard(product);
    productList.appendChild(productCard);
  });
}

// Listen for new product events from the server
socket.on('newProduct', product => {
  updateProductList([product, ...productList.querySelectorAll('.product-card')]);
});

// Listen for product update events from the server
socket.on('updateProduct', product => {
  const productCard = productList.querySelector(`.product-card[data-product-id="${product._id}"]`);
  if (productCard) {
    productCard.innerHTML = renderProductCard(product).innerHTML;
  }
});

// Listen for product delete events from the server
socket.on('deleteProduct', productId => {
  const productCard = productList.querySelector(`.product-card[data-product-id="${productId}"]`);
  if (productCard) {
    productList.removeChild(productCard);
  }
});

// Handle add-to-cart button clicks
productList.addEventListener('click', event => {
  if (event.target.classList.contains('add-to-cart')) {
    const productId = event.target.dataset.productId;
    // Send a message to the server to add the product to the cart
    socket.emit('addToCart', productId);
  }
});

// Handle form submissions
const addProductForm = document.getElementById('add-product-form');
const deleteProductForm = document.getElementById('delete-product-form');

addProductForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const stock = document.getElementById('stock').value;
  const category = document.getElementById('category').value;
  const code = document.getElementById('code').value;

  socket.emit('addProduct', { title, description, price, stock, category, code });
  addProductForm.reset();
});

deleteProductForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const id = document.getElementById('id').value;
  socket.emit('deleteProduct', id);
  deleteProductForm.reset();
});

// Initial product list rendering
socket.emit('getProducts', (products) => {
  updateProductList(products);
});

// Pagination and filtering
const pageDownButton = document.getElementById('pageDown');
const pageUpButton = document.getElementById('pageUp');
const pageButton = document.getElementById('page');
const limitButton = document.getElementById('limit');
const sortButton = document.getElementById('sort');
const queryButton = document.getElementById('query');

pageDownButton.addEventListener('click', () => {
  socket.emit('pageDown');
});

pageUpButton.addEventListener('click', () => {
  socket.emit('pageUp');
});

pageButton.addEventListener('click', () => {
  const page = prompt('Ingrese el número de página:');
  socket.emit('page', page);
});

limitButton.addEventListener('click', () => {
  const limit = prompt('Ingrese el límite de productos:');
  socket.emit('limit', limit);
});

sortButton.addEventListener('click', () => {
  const sort = prompt('Ingrese el criterio de ordenamiento (asc/desc):');
  socket.emit('sort', sort);
});

queryButton.addEventListener('click', () => {
  const query = prompt('Ingrese la categoría a filtrar:');
  socket.emit('query', query);
});
