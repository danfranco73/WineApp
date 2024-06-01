import productModel from "../dao/models/productModel.js";

export default class ProductService {
    constructor() {
        this.products = productModel;
    }

    async getProducts() {
        const page = 1;
        const limit = 10;
        const sort = null;
        const query = null;

        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                lean: true,
            };
            let products;
            if (sort) {
                products = await this.products.paginate({}, options);
                if (sort === "asc") {
                    products.docs.sort((a, b) => a.price - b.price);
                } else if (sort === "desc") {
                    products.docs.sort((a, b) => b.price - a.price);
                }
            } else if (query) {
                products = await this.products.paginate({ category: query }, options);
            } else {
                products = await this.products.paginate({}, options);
            }
            return products;
        } catch (error) {
            console.log(error);
        }
    }

    async addProduct(product) {
        try {
            const newProduct = new this.products(product);
            await newProduct.save();
            return newProduct;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getProductById(id) {
        try {
            const product = await this.products.findById(id);
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