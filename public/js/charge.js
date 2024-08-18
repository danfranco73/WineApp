const cartId = document.querySelector("input[name='cart']").value; // Wait until the DOM is fully loaded

document.addEventListener("DOMContentLoaded", function () {
  const submitPaymentButton = document.getElementById("submit-payment");
  const purchaseModal = document.getElementById("purchase-modal");

  function showModal() {
    purchaseModal.style.display = "block";
    setTimeout(function () {
      purchaseModal.style.display = "none";
    }, 5000);
  }

  submitPaymentButton.addEventListener("click", function () {
    showModal();
    fetch(`/api/carts/${cartId}/clear`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          window.location.href = "/cart";
        }
      });
  });
});
