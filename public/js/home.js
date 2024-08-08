const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    // Send a request to your server to add the product to the cart
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    })
    .then(response => {
      // Handle the response (e.g., update cart display, show success message)

    })
    .catch(error => {
      // Handle errors
    });
  });
});





document.addEventListener("DOMContentLoaded", () => {
  const pageDown = document.getElementById("pageDown");
  const pageUp = document.getElementById("pageUp");
  const page = document.getElementById("page");
  const limit = document.getElementById("limit");
  const sort = document.getElementById("sort");
  const query = document.getElementById("query");
  const productList = document.getElementById("product-list");

  pageDown.addEventListener("click", async () => {
    const response = await fetch("http://localhost:8080/api/products?page=1");
    const data = await response.json();
    console.log(data);
  });

  pageUp.addEventListener("click", async () => {
    const response = await fetch("http://localhost:8080/api/products?page=2");
    const data = await response.json();
    console.log(data);
  });

  page.addEventListener("click", async () => {
    const response = await fetch("http://localhost:8080/api/products?page=3");
    const data = await response.json();
    console.log(data);
  });

  limit.addEventListener("click", async () => {
    const response = await fetch("http://localhost:8080/api/products?limit=5");
    const data = await response.json();
    console.log(data);
  });

  sort.addEventListener("click", async () => {
    const response = await fetch("http://localhost:8080/api/products?sort=asc");
    const data = await response.json();
    console.log(data);
  });

  query.addEventListener("click", async () => {
    const response = await fetch("http://localhost:8080/api/products?query=Almacen");
    const data = await Electronicsresponse.json();
    console.log(data);
  });
});


