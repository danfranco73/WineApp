const cartId = document.querySelector("input[name='cart']").value; // Wait until the DOM is fully loaded

document.addEventListener("DOMContentLoaded", function () {
  const submitPaymentButton = document.getElementById("submit-payment");
  const purchaseModal = document.getElementById("purchase-modal");

  function showModal() {
    // Show the modal
    purchaseModal.style.display = "block";
    setTimeout(function () {
      purchaseModal.style.display = "none";
    }, 3000);
  }

  submitPaymentButton.addEventListener("click", function () {
    showModal();
    fetch(`/api/carts/${cartId}/clear`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          window.location.reload();
          window.location.href = "/cart";
        }
      });
  });
});
