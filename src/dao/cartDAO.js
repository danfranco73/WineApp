import  CartRepository from "../Repository/cartRepository.js";

export default class CartDAO {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  async getAllCarts() {
    return await this.cartRepository.getAllCarts();
  }

  async getCartById(cid) {
    return await this.cartRepository.getCartById(cid);
  }

  async createCart() {
    return await this.cartRepository.createCart();
  }

  async addProductByID(cid, pid) {
    return await this.cartRepository.addProductByID(cid, pid);
  }

  async deleteProductInCart(cid, pid) {
    return await this.cartRepository.deleteProductInCart(cid, pid);
  }

  async updateCart(cid, products) {
    return await this.cartRepository.updateCart(cid, products);
  }

  async updateProductQuantity(cid, productId, quantity) {
    return await this.cartRepository.updateProductQuantity(cid, productId, quantity);
  }

  async insertArray(cid, arrayOfProducts) {
    return await this.cartRepository.insertArray(cid, arrayOfProducts);
  }

  async clearCart(cid) {
    return await this.cartRepository.clearCart(cid);
  }

  async getTotalQuantityInCart(cid) {
    return await this.cartRepository.getTotalQuantityInCart(cid);
  }
}
