import ProductDAO from "../dao/productDAO.js";

export default class ProductService {
    constructor() {
        this.products = new ProductDAO();
    }

    async getProducts() {
    
        return await this.products.getAll();
    }

    async addProduct(product) {
         const newProduct = await this.products.create(product);
        return newProduct;
    }

    async getProductById(pid) {
        return await this.products.getById(pid);
    }

    async updateProduct(id, product) {
        return await this.products.findByIdAndUpdate(id, product, {
            new: true,
        });
    }

    async deleteProduct(id) {
        return await this.products.deleteProduct(id);
    }
}