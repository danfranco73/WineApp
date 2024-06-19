import ProductRepository from "../repository/productRepository.js";

export default class ProductService {
    constructor() {
        this.products = new ProductRepository();
    }

    async getProducts(query, options) {
        return await this.products.getProducts(query ?? {}, options);
    }

    async addProduct(product) {
        return await this.products.addProduct(product);
    }

    async getProductById(pid) {
        return await this.products.getProductById(pid);
    }

    async updateProduct(id, product) {
        return await this.products.findByIdAndUpdate(id, product, {
            new: true,
        });
    }

    async deleteProduct(id) {
        return await this.products.findByIdAndDelete(id);
    }
}