import CartDAO from "../dao/cartDAO.js";
import CartDTO from "../dao/dto/cartDTO.js";
import ticketService from "./ticketServices.js";
import ProductService from "./productServices.js"; 

const productService = new ProductService();

export default class CartService {
  constructor() {
    this.carts = new CartDAO();
  }

  // getting all the carts from the database in my ecommerce mongodb
  async getCarts() {
    try {
      const cart = await this.carts.getAll();
      if (!cart) {
        throw new Error("Cart not found");
      }
      return cart.map((c) => new CartDTO(c));
    } catch (error) {
      throw new Error(error);
    }
  }

  // adding a new cart with the user id to identify the cart
  async addCart(uid) {
    try {
      const newCart = await this.carts.addCart(uid);
      if (!newCart) {
        throw new Error("Cart not created");
      }
      return new CartDTO(newCart);
    } catch (error) {
      throw new Error(error);
    }
  }

  // updating a cart in the database
  async updateCart(cid, pid, quantity) {
    try {
      const cart = await this.carts.updateCart(cid, pid, quantity);
      if (!cart) {
        throw new Error("Cart not found");
      }
      return new CartDTO(cart);
    } catch (error) {
      throw new Error(error);
    }
  }

  // deleting a cart in the database in my ecommerce mongodb
  async deleteCart(cid) {
    try {
      return await this.carts.delete(cid);
    } catch (error) {
      throw new Error(error);
    }
  }
  // getting a cart with the user id to identify the cart
  async getCartWithUser(uid) {
    try {
      const cart = await this.carts.getCartByUserId(uid);
      if (cart) {
        return cart;        
      }
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
  // adding a product to a cart, if the user is not admin
  // if the product is already in the cart, the quantity is updated
  // if the product is not in the cart, it is added
  async addProductToCart(cid, pid ) {
    try {
    const cart = await this.carts.addProduct(cid, pid);       
    } catch (error) {
      throw new Error(error);
    }
  }
  // delete a product in my cart
  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await this.carts.deleteProductFromCart(cid, pid);
      if (!cart) {
        throw new Error("Cart not found");
      }
      return new CartDTO(cart);
    } catch (error) {
      throw new Error(error);
    }
  }

  // clear all products from a cart
  async clearCart(cid) {
    try {
      const cart = await this.carts.clearCart(cid);
      if (!cart) {
        throw new Error("Cart not found");
      }
      return new CartDTO(cart);
    } catch (error) {
      // Handle error
      throw new Error(error);
    }
  }

  // finish the purchase of a cart by cid in the database only if the user is authenticated and is the cart owner
  async purchaseCart(cid, uid) {
    const cart = await this.carts.getCartById(cid);
    const userId = uid;
    try {
      // Check if the cart is empty
      if (cart.products.length === 0) {
        throw new Error("Cart is empty");
      }
      // Check if the products in the cart are available or have enough stock 
      const productsToBuy = [];
      const productsNotToBuy = [];
      for (const p of cart.products) {
        const product = await productService.getProductById(p.product._id);
        if (product.stock >= p.quantity) {
          productsToBuy.push(p);
        } else {
          productsNotToBuy.push(p);
        }
        // clear the products not to buy from the cart
        const newCart = cart.products.filter((product) => {
          return !productsNotToBuy.some((p) => p.product._id == product._id);
        }
        );
      }
      // Update the cart with the products to buy
      const updatedCart = await this.updateCart(cid, newCart);
      // Update the stock of the products to buy
      for (const p of productsToBuy) {
        await productService.updateProductStock(p.product._id, p.quantity * -1);
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
