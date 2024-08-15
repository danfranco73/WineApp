// cart.js
document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.querySelector('.container');

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/carts',{
        method: 
      });
      if (!response.ok) {
        throw new Error('Error fetching cart data');
      }
      const cartData = await response.json();
      renderCart(cartData.payload);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Handle the error appropriately, e.g., display an error message
    }
  };

  const renderCart = (cart) => {
    cartContainer.innerHTML = ''; // Clear previous cart content

    if (cart.products.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }

    // Iterate through each product in the cart
    cart.products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
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
        <button type="button" class="purchase-the-cart" data-pid="${product._id}">Purchase</button>
      `;
      cartContainer.appendChild(productCard);
    });
  };


fetchCart(); // Fetch the cart data when the page loads
});

const totalElement = document.getElementById('total');
const checkoutButton = document.querySelector('.checkout');

// Function to update the total price in the cart
function updateTotal() {
  let totalPrice = 0;
  const products = document.querySelectorAll('.product-card');
  products.forEach(product => {
    const priceElement = product.querySelector('.product-price');
    if (!priceElement){
    const price = parseFloat(priceElement.textContent.replace(' Precio: $', ''));
    totalPrice += price;
    } else {
      console.error('Price element not found', product);
    }
  });
  totalElement.textContent = totalPrice.toFixed(2);
}

// Function to handle the checkout button click
checkoutButton.addEventListener('click', () => {
  // Get the cart ID from the hidden input field
  const cartId = document.querySelector('input[name="cart"]').value;

  // Redirect to the checkout page with the cart ID
  window.location.href = `/checkout?cartId=${cartId}`;
});

// Initial update of the total price
updateTotal();
