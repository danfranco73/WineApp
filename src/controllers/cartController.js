import CartService from "../services/cartServices.js";

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  async getCarts() {
    return await this.cartService.getCarts();
  }

  async getCartByUserId(uid) {
    return await this.cartService.getCartWithUser(uid);
  }

  async addCart(uid) {
    return await this.cartService.addCart(uid);
  }

  async createCart(uid) {
    try {
      const cart = await this.cartService.addCart(uid);
      return cart._id;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating cart");
    }
  }

  async getCartById(cid) {
    return await this.cartService.getCartById(cid);
  }

  async updateCart(cid, pid, quantity) {
    return await this.cartService.updateCart(cid, pid, quantity);
  }

  async deleteCart(cid) {
    return await this.cartService.deleteCart(cid);
  }

  async addProductToCart(cid, pid ) {
    const cart = await this.cartService.addProductToCart(cid, pid );
  }

  async deleteProductFromCart(cid, pid) {
    return await this.cartService.deleteProductFromCart(cid, pid);
  }

  async clearCart(cid) {
    return await this.cartService.clearCart(cid);
  }

  async purchaseCart(cid, uid) {
    const cart = await this.cartService.getCartById(cid);
    if (cart.user._id !== uid) {
      throw new Error("Forbidden");
    }
    // purchase the cart
    const ticket = await this.cartService.purchaseCart(cid);
    return ticket;
  }
 // c


}

export default CartController;
