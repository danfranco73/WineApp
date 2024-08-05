const socket = io();

// escucho al servidor
socket.on("productList", (products) => {
  renderProducts(products);
});

const renderProducts = (products) => {
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = "";
  products.forEach((product) => {
    const newProduct = document.createElement("li");
    newProduct.textContent = `id: ${product._id}, Title: ${product.title}, Description: ${product.description}, Price: ${product.price}`;
    productsList.appendChild(newProduct);
  });
  };

// // envio un nuevo producto al servidor en su emit "newProduct"
const addProductForm = document.getElementById("add-product-form");

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  const code = document.getElementById("code").value;
  const newProduct = {
    title,
    description,
    price,
    stock,
    category,
    code,
  };
  logger.info(newProduct);
  // renderProducts(newProduct);
  socket.emit("newProduct", newProduct);
});

// send a delete product to the server
const deleteProductForm = document.getElementById("delete-product-form");

deleteProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const _id = document.getElementById("id").value;
  socket.emit("deleteProduct", _id);
  // show the product list
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = "";
  products.forEach((product) => {
    const newProduct = document.createElement("li");
    newProduct.textContent = `Title: ${product.title}, Description: ${product.description}, Price: ${product.price}`;
    productsList.appendChild(newProduct);
  });
});

document.addEventListener("DOM", () => {
  const pageDown = document.getElementById("pageDown");
  const pageUp = document.getElementById("pageUp");
  const page = document.getElementById("page");
  const limit = document.getElementById("limit");
  const sort = document.getElementById("sort");
  const query = document.getElementById("query");

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


