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
      .populate("products.cpid")
      .populate("user")
      .lean();
    return cart;
  }
  // get a cart by its id
  async getCartById(cid) {
    const cart = await cartModel
      .findById({ _id: cid })
      .populate("products.cpid")
      .populate("user")
      .lean();
    console.log("Cart retrieved:", cart); // Add logging
    if (!cart) {
      return { message: "Cart not found" };
    }
    return cart;
  }

  // adding a product to a user cart with quantity
  async addProduct(cid, pid) {
    try {
      if(!cid || !pid) {
        return { message: "Cart or Product ID missing" };
      }
      const cart = await cartModel.findById(cid);
      if (!cart) {
        return { message: "Cart not found" };
      }
      const existingProductIndex = cart.products.findIndex(
        (product) => product._id.toString() === pid
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity++;
      } else {
        cart.products.push({ _id: pid, quantity: 1 });
      }
      await cart.save();
      return { message: "Product added to cart successfully" , cart};
    } catch (error) {
      return { message: error.message };
    }
  }
  // getting a cart by the user id
  async getCartByUserId(uid) {
    const cart = await cartModel.findOne({ user: uid }).lean();
    if (!cart) {
      return { message: "Cart not found" };
    }
    return cart;
  }

  async updateCart(cid, products) {
    try {
      const cart = await cartModel
        .findOneAndUpdate({ _id: cid }, { products }, { new: true })
        .populate("products._id");
      if (!cart) {
        return { message: "Cart not found" };
      }
      return cart;
    } catch (error) {
      return { message: error.message };
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { cpid: pid } } },
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
