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
        const user = req.session.user; // from viewsRouter.js
        const product = await this.productService.getProductById(pid);
        if(!product) {
            throw new Error("Product not found");
        }
        if(user.role === "premium" && product.owner !== user.email) {
            throw new Error("You are not allowed to delete this product");
        }
        await this.productService.deleteProduct(pid);

        return product;
    }
}

export default productController;

