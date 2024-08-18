// Purpose: To handle the cart functionality
const cartId = document.querySelector("input[name='cart']").value;
console.log(cartId);

document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-from-cart");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.getAttribute("data-pid");
      const response = await fetch(
        `/api/carts/${cartId}/product/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        window.location.reload();
        // Create a temporary message element
        const message = document.createElement("div");
        message.textContent = "Product deleted!";
        message.classList.add("delete-message"); // Add a class for styling
        // Append the message to the body
        document.body.appendChild(message);
        // Set a timeout to remove the message after 2 seconds
        setTimeout(() => {
          document.body.removeChild(message);
        }, 1000);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-quantity")) {
      const pid = e.target.getAttribute("data-pid");
      fetch(`/api/carts/${cartId}/product/${pid}`, {
        method: "PUT",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            window.location.reload();
            // Create a temporary message element
            const message = document.createElement("div");
            message.textContent = "Product added!";
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

  // Add event listener to the  clear-cart  button
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("clear-cart")) {
      fetch(`/api/carts/${cartId}/clear`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            window.location.reload();
            // Create a temporary message element
            const message = document.createElement("div");
            message.textContent = "Cart cleared!";
            message.classList.add("delete-message"); // Add a class for styling
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
});
