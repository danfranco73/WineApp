import productModel from "./models/productModel.js";

export default class ProductDAO {
  constructor() {
    this.products = productModel;
  }

  getAll = async () => {
    const products = await this.products.find().lean();
    return products;
  };

  async create(product) {
    try {
      const newProduct = new this.products(product);
      return await newProduct.save();
    } catch (error) {
      console.log(error);
    }
  }

  async getById(pid) {
    return await this.products.findById(pid);
  }

  async update(pid, product) {
    return await this.products.findByIdAndUpdate(pid, product, {
      new: true,
    });
  }

  async delete(pid) {
    return await this.products.findByIdAndDelete(pid);
  }
}
