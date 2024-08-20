import ProductDAO from "../dao/productDAO.js";

export default class ProductService {
  constructor() {
    this.products = new ProductDAO();
  }

  async getProducts() {
    return await this.products.getAll();
  }

  async addProduct(product) {
    return await this.products.create(product);
  }

  async reduceStock(pid, quantity) {
    return await this.products.reduceStock(pid, quantity);
  }

  async getProductById(pid) {
    return await this.products.getById(pid);
  }

  async updateProduct(pid, product) {
    return await this.products.update(pid, product);
  }

  async deleteProduct(pid) {
    return await this.products.delete(pid);
  }
}
