import CartRepository from "../repository/cartRepository.js";
import ticketService from "./ticketServices.js"; // Assuming you have a ticketService

export default class CartService {
  constructor() {
    this.carts = new CartRepository();
  }

  // getting all the carts from the database in my ecommerce mongodb
  async getCarts() {
    try {
      return await this.carts.getCarts();
    } catch (error) {
      throw new Error(error);
    }
  }

  // adding a new cart to the database in my ecommerce mongodb
  async addCart(cart) {
    try {
      return await this.carts.addCart(cart);
    } catch (error) {
      throw new Error(error);
    }
  }

  // updating a cart in the database
  async updateCart(cid, cart) {
    try {
      return await this.carts.updateCart(cid, cart);
    } catch (error) {
      throw new Error(error);
    }
  }

  // deleting a cart in the database in my ecommerce mongodb
  async deleteCart(cid) {
    try {
      return await this.carts.deleteCart(cid);
    } catch (error) {
      throw new Error(error);
    }
  }

  // getting a cart by id in the database in my ecommerce mongodb
  async getCartById(cid) {
    try {
      return await this.carts.getCartById(cid);
    } catch (error) {
      throw new Error(error);
    }
  }

  // adding a product to a cart
  async addProductToCart(cid, pid, quantity) {
    try {
      return await this.carts.addProductToCart(cid, pid, quantity);
    } catch (error) {
      throw new Error(error);
    }
  }

  // delete a product in my cart
  async deleteProductFromCart(cid, pid) {
    try {
      return await this.carts.deleteProductFromCart(cid, pid);
    } catch (error) {
      throw new Error(error);
    }
  }

  // clear all products from a cart
  async clearCart(cid) {
    try {
      const cart = await this.carts.getCartById(cid);
      cart.products = [];
      await this.updateCart(cid, cart);
      return cart;
    } catch (error) {
        // Handle error
        throw new Error(error);
    }
  }

  // finish the purchase of a cart by cid in the database only if the user is authenticated and is the cart owner in my ecommerce mongodb
  async purchaseCart(cid) {
    try {
      const cart = await this.carts.getCartById(cid);
      const products = cart.products;
      const productsToBuy = [];
      const productsNotToBuy = [];

      for (const product of products) {
        const stock = product.product.stock;
        if (stock >= product.quantity) {
          // Update product stock in the database
          product.product.stock -= product.quantity;
          await product.product.save(); // Save the updated product
          productsToBuy.push(product);
        } else {
          productsNotToBuy.push(product);
        }
      }

      // Create a ticket for products that couldn't be purchased
      await ticketService.addTicket({
        products: productsNotToBuy,
        Amount: productsToBuy.reduce(
          (acc, p) => acc + p.product.price * p.quantity,
          0
        ),
      });

      // Clear the cart
      await this.clearCart(cid);

      return productsToBuy;
    } catch (error) {
      throw new Error(error);
    }
  }

  // update the quantity of a product in a cart
  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await this.carts.getCartById(cid);
      const productIndex = cart.products.findIndex((p) => p._id == pid);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
      }
      await this.updateCart(cid, cart);
      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }
}
