import CartService from "../../services/cartServices.js";


class CartManagerDB {
  constructor() {
    this.cartService = new CartService();
  }

  async getCarts() {
    return await this.cartService.getCarts();
  }

  async addCart(cart) {
    return await this.cartService.addCart(cart);
  }

  async getCartById(id) {
    return await this.cartService.getCartById(id);
  }

  async updateCart(id, cart) {
    return await this.cartService.updateCart(id, cart);
  }

  async deleteCart(id) {
    return await this.cartService.deleteCart(id);
  }

  async addProductToCart(cid, pid) {
    return await this.cartService.addProductToCart(cid, pid);
  }

  async deleteProductFromCart(cid, pid) {
    return await this.cartService.deleteProductFromCart(cid, pid);
  }

  async purchaseCart(cid) {
    return await this.cartService.purchaseCart(cid);
  }


  async updateProductQuantity(cid, pid, quantity) {
    return await this.cartService.updateProductQuantity(cid, pid, quantity);
  }

  async clearCart(cid) {
    return await this.cartService.clearCart(cid);
  }


}
export default CartManagerDB;
