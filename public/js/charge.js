const cartId = document.querySelector("input[name='cart']").value; // Wait until the DOM is fully loaded

document.addEventListener("DOMContentLoaded", function () {
  const submitPaymentButton = document.getElementById("submit-payment");
  const purchaseModal = document.getElementById("purchase-modal");

  function showModal() {
    // Show the modal
    purchaseModal.style.display = "block";
    setTimeout(function () {
      purchaseModal.style.display = "none";
    }, 2000);
  }

  submitPaymentButton.addEventListener("click", function () {
    fetch(`api/carts/${cartId}/purchase`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          window.location.href = "/home";
          showModal();
        }
      });
  });

  // show the prducts in cart-summary class
  const cartSummary = document.querySelector(".cart-summary");
});
