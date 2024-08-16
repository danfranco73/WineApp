
// Purpose: To handle the cart functionality
const cartId = document.querySelector("input[name='cart']").value;
console.log(cartId);


document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-from-cart");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.getAttribute("data-pid");
      const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        window.location.reload();
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
          console.log(data);
          if (data.status === "success") {
            window.location.reload();
          }
        });
    }
  });

  const checkoutButton = document.querySelector(".checkout");
  checkoutButton.addEventListener("click", async () => {
    const cartId = document.querySelector("input[name='cart']").value;
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
      method: "POST",
    });
    if (response.ok) {
      window.location.reload();
    }
  });

});

