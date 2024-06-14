import ProductRepository from "../dao/repository/productRepository.js";


export default class ProductService {
    constructor() {
        this.products = new ProductRepository();
    }

    async getProducts(query, page, limit, sort) {
        const options = {
            page: page ?? 1,
            limit: limit ?? 10,
            sort: sort ?? null,
            lean: true,
        }
        return await this.products.getProducts(query ?? {}, options);

    }

    async addProduct(product) {
        try {
            return await this.products.addProduct(product);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getProductById(pid) {
        try {
            const product = await this.products.getProductById(pid);
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, product) {
        try {
            const updatedProduct = await this.products.findByIdAndUpdate(id, product, {
                new: true,
            });
            return updatedProduct;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            await this.products.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
        }
    }
}