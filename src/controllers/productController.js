import ProductService from "../services/productServices.js";
import ProductDTO from "../dao/dto/productDTO.js";


export default class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  // Get all products
  getProducts = async (req, res, next) => {
    try {
      return await this.productService.getProducts();
    } catch (error) {
      next(error);
    }
  };

  addProduct = async (req, res, next) => {
  const { title, description, price, stock, category } = req.body;
  const product = new ProductDTO(req.body);
  return await this.productService.addProduct(product);
};

  getProductById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await ProductService.getProductById(pid);
    if (!product) {
      throw new Error("Product not found");
    }
   return res.send({ status: "success", payload: product });
  } catch (error) {
    next(error);
  }
};
  updateProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = new ProductDTO(req.body);
    return await ProductService.updateProduct(pid, product);
  } catch (error) {
    next(error);
  }
};

  deleteProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const user = req.user;
    const product = await ProductService.getProductById(pid);
    if (!product) {
      throw new Error("Product not found");
    }
    if (user.role === "premium" && product.owner !== user.email) {
      throw new Error("You are not allowed to delete this product");
    }
    return await ProductService.deleteProduct(pid);
  } catch (error) {
    next(error);
  }
};

}