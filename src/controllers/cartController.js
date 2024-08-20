import CartService from "../services/cartServices.js";
import ProductService from "../services/productServices.js";
import TicketService from "../services/ticketServices.js";

const ticketService = new TicketService();

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
  async purchaseCart(cid, purchaser) {
    // console.log(purchaser, "purchaser"); user _id ok
    try {
      const cart = await this.cartService.getCartById(cid);
      // hago el map para obtener los productos del carrito
      const products = cart.products.map((product) => {
        return {
          _id: product._id,
          quantity: product.quantity,
        };
      });
      // console.log(products, "products"); ok

      // obtengo el total de la compra
      const totalAmount = await this.cartService.amountEachProductInCart(cid);
      // console.log(cart, "del purchase"); ok
      // Check if the cart is empty
      if (cart.products.length === 0) {
        throw new Error("El carrito esta vacio");
      }
      // check if the stock is enough for each product
      for (const product of products) {
        const productData = await productService.getProductById(product._id);
        if (productData.stock < product.quantity) {
          throw new Error("No hay suficiente stock de " + productData.title);
        }
      }
      // reduce the stock of each product
      for (const product of products) {
        await productService.reduceStock(product._id, product.quantity);
      }
      // return the ticket with the products purchased and the total amount
      // clear the cart after the purchase
      
      const ticket = await ticketService.createTicket(
        purchaser,
        products,
        totalAmount
      );
      await this.cartService.clearCart(cid);
      return ticket;
      
    } catch (e) {
      console.log(e);
    }
  }
}

export default CartController;
