import ProductDAO from "../dao/productDAO.js";
import ProductDTO from "../dao/dto/productDTO.js";
import { query } from "express";


export default class ProductRepository {
    constructor() {
        this.products = new ProductDAO();
    }
    async getProducts(page,limit,sort,query) {
        return await this.products.getAll(page,limit,sort,query);
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