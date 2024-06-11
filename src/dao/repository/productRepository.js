import ProductDAO from "../productDAO.js";
import ProductDTO from "../dto/productDTO.js";


export default class ProductRepository {
    constructor() {
        this.products = new ProductDAO();
    }

    async getProducts(limit, page, sort, query) {
        try {
            return await this.products.getAll(query, {
                page: parseInt(page)?? 1,
                limit: parseInt(limit)?? 10,
                sort: sort?? null,
                lean: true,
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    async addProduct(product) {
        // I used the ProductDTO class to create a new product object
        const newProduct = new ProductDTO(product);
        try {
            return await this.products.create(newProduct);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getProductById(pid) {
        try {
            const product = await this.products.getById(pid);
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(pid, product) {
        try {
            const updatedProduct = await this.products.update(pid, product, {
                new: true,
            });
            return updatedProduct;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            await this.products.delete(id);
        } catch (error) {
            console.log(error);
        }
    }
}