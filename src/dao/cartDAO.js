import cartModel from "./models/cartModel.js";
import productModel from "./models/productModel.js";
import userModel from "./models/userModel.js";

export default class CartDAO {
  // adding a cart to the database
  async addCart(uid) {
    const user = await userModel.findOne({ _id: uid });
    if (!user) {
      return { message: "User not found" };
    }
    const cart = await cartModel.findOne({ user: uid });
    if (cart) {
      return { message: "Cart already exists" };
    }
    const newCart = new cartModel({ user: uid });
    return await newCart.save();
  }
  // get all the carts in the database
  async getAll() {
    const cart = await cartModel
      .find()
      .populate("products.product")
      .populate("user")
      .lean();
    return cart;
  }
  // get a cart by its id
  async getCartById(cid) {
    const cart = await cartModel
      .findById({ _id: cid })
      .populate("products.product")
      .populate("user")
      .lean();
    if (!cart) {
      return { message: "Cart not found" };
    }
    return cart;
  }
  // adding a product to a user cart with quantity
  // check if the cart exists
  // check if the product exists
  // check if the product is already in the cart then add the quantity
  // if the product is not in the cart add the product to the cart with the quantity
  async addProduct(cid, pid, quantity) {
    const cart = await cartModel.findOne({ _id: cid });
    if (!cart) {
      return { message: "Cart not found" };
    }
    const product = await productModel.findOne({ _id: pid });
    if (!product) {
      return { message: "Product not found" };
    }
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    return await cart.save();
  }
  // getting a cart by the user id
  async getCartByUserId(uid) {
    const cart = await cartModel
      .findOne({ user: uid })
      .populate("products.product")
      .populate("user")
      .lean();
    if (!cart) {
      return { message: "Cart not found" };
    }
    return cart;
  }

  async update(cid, pid, quantity) {
    return await cartModel.updateOne({ _id: cid }, { pid, quantity });
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid } } },
        { new: true }
      );
      return cart;
    } catch (err) {
      return { message: err.message };
    }
  }
  // clearing the cart by setting the products array to an empty array
  async clearCart(cid) {
    try {
      const cart = await cartModel.findOneAndUpdate(
        { _id: cid },
        { products: [] },
        { new: true }
      );
      return cart;
    } catch (err) {
      return { message: err.message };
    }
  }

  async delete(cid) {
    await cartModel.deleteOne({ _id: cid });
    return { message: "Cart deleted successfully" };
  }

  // delete cart with no user
  async deleteCartWithNoUser() {
    try {
      const cart = await cartModel.deleteOne({ user: null });
      return cart;
    } catch (err) {
      return { message: err.message };
    }
  }
}
