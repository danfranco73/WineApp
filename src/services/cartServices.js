import CartDAO from "../dao/cartDAO.js";

export default class CartService {
  constructor() {
    this.carts = new CartDAO();
  }

  // getting all the carts from the database in my ecommerce mongodb
  async getCarts() {
    return await this.carts.getAllCarts();
  }
  // getting cart by id
  async getCartById(cid) {
    return await this.carts.getCartById(cid);
  }
  // creating a new cart
  async addCart() {
    return await this.carts.createCart();
  }
  // adding a product to a cart
  async addProductToCart(cid, pid) {
    return await this.carts.addProductByID(cid, pid);
  }
  // deleting a product from a cart
  async deleteProductFromCart(cid, pid) {
    return await this.carts.deleteProductInCart(cid, pid);
  }
  // updating a cart
  async updateCart(cid, products) {
    return await this.carts.updateCart(cid, products);
  }
  // updating a product quantity in a cart
  async updateProductQuantity(cid, productId, quantity) {
    return await this.carts.updateProductQuantity(cid, productId, quantity);
  }
  // inserting an array of products in a cart
  async insertArray(cid, arrayOfProducts) {
    return await this.carts.insertArray(cid, arrayOfProducts);
  }
  // clearing a cart
  async clearCart(cid) {
    return await this.carts.clearCart(cid);
  }
  // getting the amount of each product in a cart
  async amountEachProductInCart(cid) {
    return await this.carts.amountEachProductInCart(cid);
  }
  // getting the total quantity of products in a cart
  async getTotalQuantityInCart(cid) {
    return await this.carts.getTotalQuantityInCart(cid);
  }
}
