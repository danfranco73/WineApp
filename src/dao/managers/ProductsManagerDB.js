// this is my product manager model using mongoose
import ProductService from "../../services/productServices.js";

class ProductsManagerDB {
    constructor() {
        this.productService = new ProductService();
    }

    async getProducts() {
        return await this.productService.getProducts();
    }

    async addProduct(product) {
        return await this.productService.addProduct(product);
    }

    async getProductById(id) {
        return await this.productService.getProductById(id);
    }

    async updateProduct(id, product) {
        return await this.productService.updateProduct(id, product);
    }

    async deleteProduct(id) {
        return await this.productService.deleteProduct(id);
    }
}

export default ProductsManagerDB;

