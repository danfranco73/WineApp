import productModel from "./models/productModel.js";

export default class ProductDAO {

async getAll() {
    return await productModel.find().lean();
  }
  
  async create(product) {
      const newProduct = new productModel(product);
      return await newProduct.save();
  }

  async getById(pid) {
    return await productModel.findById(pid).lean();
  }

  async update(pid, product) {
    return await productModel.findByIdAndUpdate(pid, product, {
      new: true,
    });
  }

  async delete(pid) {
    return await productModel.findByIdAndDelete(pid);
  }
}
