// Initiating the home page
const home = () => {
  // get the products from the database
  fetch("/api/products")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const products = data.payload;
      const productsContainer = document.querySelector(".products-container");
      productsContainer.innerHTML = "";
      products.forEach((product) => {
        productsContainer.innerHTML += `
          <div class="product-card">
            <img src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button class="add-to-cart" data-pid="${product._id}">Add to cart</button>
          </div>
        `;
      });
    });
};

home();
const cartId = document.querySelector("input[name='cart']").value;
//  in my home.handlebats the button to add a product to the cart using the logged user id to get my cart id and product id to add to the cart
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const pid = e.target.getAttribute("data-pid");
    fetch(`/api/carts/${cartId}/product/${pid}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // Create a temporary message element
          const message = document.createElement("div");
          message.textContent = "Product added to cart!";
          message.classList.add("success-message"); // Add a class for styling
          // Append the message to the body
          document.body.appendChild(message);
          // Set a timeout to remove the message after 2 seconds
          setTimeout(() => {
            document.body.removeChild(message);
          }, 1000);
        }
      });
  }
});
