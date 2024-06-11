import productModel from "./models/productModel.js";

export default class ProductDAO {
    async create(product) {
        const newProduct = new productModel(product);
        return await newProduct.save();
    }

    async getAll(query, options) {
        return await productModel.paginate(query, options);
    }

    async getById(pid) {
        return await productModel.findOne({ _id: pid });
    }

    async update(pid, product) {
        return await productModel.updateOne({ _id: pid }, product, { new: true });
    }

    async delete(pid) {
        await productModel.deleteOne({ _id: pid });
        return { message: "Product deleted successfully" };
    }
}