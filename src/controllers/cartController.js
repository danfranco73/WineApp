import CartService from "../services/cartServices.js";
import ProductService from "../services/productServices.js";
import ticketService from "../services/ticketServices.js";

const productService = new ProductService();

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  async getCarts() {
    return await this.cartService.getCarts();
  }
  async createCart(uid) {
    return await this.cartService.addCart(uid);
  }

  async getCartById(cid) {
    return await this.cartService.getCartById(cid);
  }

  async updateCart(cid, pid, quantity) {
    return await this.cartService.updateCart(cid, pid, quantity);
  }

  async deleteCart(cid) {
    return await this.cartService.clearCart(cid);
  }

  async addProductToCart(cid, pid) {
    console.log(cid, pid);

    const cart = await this.cartService.addProductToCart(cid, pid);
    return cart;
  }

  async deleteProductFromCart(cid, pid) {
    return await this.cartService.deleteProductFromCart(cid, pid);
  }

  async clearCart(cid) {
    return await this.cartService.clearCart(cid);
  }
  async amountEachProductInCart(cid) {
    return await this.cartService.amountEachProductInCart(cid);
  }

  async updateProductQuantity(cid, productId, quantity) {
    return await this.cartService.updateProductQuantity(
      cid,
      productId,
      quantity
    );
  }

  async getTotalQuantityInCart(cid) {
    return await this.cartService.getTotalQuantityInCart(cid);
  }
// creo un ticket con los productos del carrito, el monto total y el id del usuario, la fecha y el purchaser, y luego elimino el carrito
  async purchaseCart(cid) {
    try{
    const cart = await this.cartService.getCartById(cid);
    const products = await productService.getProductById(cart.products);
    const totalAmount = await this.cartService.amountEachProductInCart(cid);
    const user = await userService.getUserById(cart.user);
    const newTicket = await ticketService.createTicket({
      email: user.email,
      amount: totalAmount,
      products,
      purchaser: user._id,
      date: new Date(),
    });
    await this.cartService.clearCart(cid);
    return newTicket;
  }
  catch(e){
    console.log(e);
  }
  }
}

export default CartController;
