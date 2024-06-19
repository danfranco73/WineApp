import ProductDAO from "../dao/productDAO.js";
import ProductDTO from "../dao/dto/productDTO.js";


export default class ProductRepository {
    constructor() {
        this.products = new ProductDAO();
    }

    async getProducts(query, options) {
        return await this.products.getAll(query, options);
    }

    async addProduct(product) {
        // I used the ProductDTO class to create a new product object
        const newProduct = new ProductDTO(product);
        return await this.products.create(newProduct);
    }

    async getProductById(pid) {
        const product = await this.products.getById(pid);
        return product;
    }

    async updateProduct(pid, product) {
        const updatedProduct = await this.products.update(pid, product, {
            new: true,
        });
        return updatedProduct;
    }

    async deleteProduct(id) {
        await this.products.delete(id);
    }
}