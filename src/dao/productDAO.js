import productModel from "./models/productModel.js";

export default class ProductDAO {

async getAll() {
    return await productModel.find().lean();
  }
  
  async create(product) {
    return await productModel.create(product);
  }

  async reduceStock(pid, quantity) {
    return await productModel.findByIdAndUpdate(pid, {
      $inc: { stock: -quantity },
    });
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
  async deleteCartWithNoUser() {
    return await productModel.deleteMany({ owner: null });
  }
}
