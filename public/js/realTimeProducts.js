// this is the js code for my realTimeProducts.handlebars

const realTimeProducts = () => {
  fetch("/api/products")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
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
            <p>$${product.thumbnails}</p>
            <p>$${product.category}</p>
            <p>$${product.stock}</p>
            <p>$${product.owner}</p>
            <button class="add-to-cart" data-pid="${product._id}">Add to cart</button>
              <button class="delete-product" data-pid="${product._id}">Delete</button>
          </div>
        `;
      });
    });
};

realTimeProducts();

const cartId = document.querySelector("input[name='cart']").value;
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const pid = e.target.getAttribute("data-pid");
    fetch(`/api/carts/${cartId}/product/${pid}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-product")) {
    const pid = e.target.getAttribute("data-pid");
    fetch(`/api/products/${pid}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          realTimeProducts();

        } else {
          // Create a temporary message element
          const message = document.createElement("div");
          message.textContent = "Product not deleted!";
          message.classList.add("error-message"); // Add a class for styling
          // Append the message to the body
          document.body.appendChild(message);
          // Set a timeout to remove the message after 2 seconds
          setTimeout(() => {
            document.body.removeChild(message);
          }, 3000);
        }
      });
  }

  // js for the add to Database button in my realTimeProducts.handlebars usin the id="add-product-form"
  document
    .querySelector("#add-product-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.querySelector("#title").value;
      const description = document.querySelector("#description").value;
      const price = document.querySelector("#price").value;
      const thumbnails = document.querySelector("#thumbnails").value;
      const category = document.querySelector("#category").value;
      const stock = document.querySelector("#stock").value;
      fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          price,
          thumbnails,
          category,
          stock,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status === "success") {
            // Create a temporary message element
            const message = document.createElement("div");
            message.textContent = "Product added to the Database!";
            message.classList.add("success-message"); // Add a class for styling
            // Append the message to the body
            document.body.appendChild(message);
            // Set a timeout to remove the message after 2 seconds
            setTimeout(() => {
              document.body.removeChild(message);
            }, 2000);
          }
        });
    });
});
