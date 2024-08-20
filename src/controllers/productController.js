import ProductService from "../services/productServices.js";
import ProductDTO from "../dao/dto/productDTO.js";

export default class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  // Get all products
  async getProducts () {
    try {
      return await this.productService.getProducts();
    } catch (error) {
      next(error);
    }
  };

 // Add a new product
 async addProduct (newProduct) {
    try {
      return await this.productService.addProduct(newProduct);
    } catch (error) {
      next(error);
    }
  }

  async getProductById (pid) {
    try {
      const product = await this.productService.getProductById(pid);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      console.log(error);      
    }
  };

  async updateProduct (pid, product) {
    try {
      return await this.productService.updateProduct(pid, product);
    } catch (error) {
      next(error);
    }
  };

  async reduceStock (pid, quantity) {
    try {
      return await this.productService.reduceStock(pid, quantity);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct (pid){
    try {
      const product = await this.productService.getProductById(pid);
      if (!product) {
        throw new Error("Product not found");
      }
      return await this.productService.deleteProduct(pid);
    } catch (error) {
      next(error);
    }
  };
}
