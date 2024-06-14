// this is my product manager model using mongoose
import ProductService from "../services/productServices.js";

class productController {
    constructor() {
        this.productService = new ProductService();
    }

    async getProducts() {
        return await this.productService.getProducts();
    }

    async addProduct(product) {
        return await this.productService.addProduct(product);
    }

    async getProductById(pid) {
        return await this.productService.getProductById(pid);
    }

    async updateProduct(pid, product) {
        return await this.productService.updateProduct(pid, product);
    }

    async deleteProduct(pid) {
        return await this.productService.deleteProduct(pid);
    }
}

export default productController;

