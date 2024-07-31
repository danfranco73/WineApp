import productModel from "./models/productModel.js";

export default class ProductDAO {
  constructor() {
    this.products = productModel;
  }

  async getAll(page,limit,sort,query) {
    return await this.products.find(query).lean().limit(limit).skip((page - 1) * limit).sort(sort);
  }

  async create(product) {
    return await this.products.save(product);
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