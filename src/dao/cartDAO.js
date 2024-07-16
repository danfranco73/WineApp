import cartModel from './models/cartModel.js';
import productModel from './models/productModel.js';

export default class CartDAO {
    async create(cart) {
        const newCart = new cartModel(cart);
        return await newCart.save();
    }

    async getAll(query, options) {
        return await cartModel.find(query, options);
    }

    async getById(cid) {
        return await cartModel.findOne({ _id: cid });
    }

    async addProduct(cid, pid, quantity) {
        const cart = await cartModel.findOne({ _id: cid });
        const product = await productModel.findOne({ _id: pid });
        if (!product) {
            throw new Error("Product not found");
        }
        const index = cart.products.findIndex((p) => p.product === pid);
        if (index === -1) {
            cart.products.push({ product: pid, quantity });
        } else {
            cart.products[index].quantity += quantity;
        }
        return await cart.save();
    }

    async update(cid, cart) {
        return await cartModel.updateOne({ _id: cid }, cart, { new: true });
    }

    async removeProduct(cid, pid) {
        const cart = await cartModel.findOne({ _id: cid });
        cart.products = cart.products.filter((p) => p.product !== pid);
        return await cart.save();
    }
    
    async delete(cid) {
        await cartModel.deleteOne({ _id: cid });
        return { message: "Cart deleted successfully" };
    }
}