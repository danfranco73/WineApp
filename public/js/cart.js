const addProduct = document.querySelectorAll("#button");
const productList = document.getElementById("product-list");

addProduct.forEach(myButton => {
    myButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const productId = myButton.dataset.productId;
        const cartId = productList.dataset.cartId;
        
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId, cartId })
            });
            
            if (response.ok) {
                console.log("Product added successfully");
            }
        } catch (error) {
            console.error(error);
        }
    });
});

