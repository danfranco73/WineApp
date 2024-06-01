import { error } from "console";
import fs from "fs";

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
  }

  getProducts() {
    if (fs.existsSync(this.path)) {
      this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    } else {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, "\t"));
    }
    return this.products;
  }

  getProductById(id) {
    const products = this.getProducts();
    return this.products.find((product) => product.id === parseInt(id));
  }

  addProduct(product) {
    const products = this.getProducts();
    const maxId = products.reduce(
      (acc, product) => (product.id > acc ? product.id : acc),
      0
    );
    const newProductId = maxId + 1;
    const newProduct = { ...product, id: newProductId };
    products.push(newProduct);
    fs.writeFileSync(this.path, JSON.stringify(products, null, "\t"));
    return newProduct;
  }

  updateProduct(id, product) {
    try {
      const products = this.getProducts();
      const index = products.findIndex(
        (product) => product.id === parseInt(id)
      );
      if (index !== -1) {
        products[index] = { ...products[index], ...product };
        fs.writeFileSync(this.path, JSON.stringify(products, null, "\t"));
        return products[index];
      } else {
        console.log("no se encontro el producto");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const index = products.findIndex((product) => product.id === parseInt(id));
    if (index !== -1) {
      products.splice(index, 1);
      fs.writeFileSync(this.path, JSON.stringify(products, null, "\t"));
      return true;
    } else {
      return false;
    }
  }
}

export default ProductManager;
