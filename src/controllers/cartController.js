import CartService from "../services/cartServices.js";
import ProductService from "../services/productServices.js";
import ticketService from "../services/ticketServices.js";

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  async getCarts() {
    return await this.cartService.getCarts();
  }
  async createCart() {
    return await this.cartService.addCart();
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
  async purchaseCart(cid) {
    try {
      const cart = await this.cartService.getCartById(cid);
      if (cart.products.length === 0) {
        return { status: "error", message: "Cart is empty" };
      }
      if (!cart) {
        return { status: "error", message: "Cart not found" };
      }
      const productsInCart = cart.products;
      let productsBuy = [], productsNotBuy = [];
      let productsAmount = 0, productsNotBuyAmount = 0;
      for (let i = 0; i < productsInCart.length; i++) {
        const product = await ProductService.getProductById(productsInCart[i]._id);
        if (product.stock >= productsInCart[i].quantity) {
          productsBuy.push(product);
          productsAmount += product.price * productsInCart[i].quantity;
          // update stock in db
          const newStock = product.stock - productsInCart[i].quantity;
          await ProductService.updateProduct(product._id, { stock: newStock });

        } else {
          productsNotBuy.push(product);
          productsNotBuyAmount += product.price * productsInCart[i].quantity;
        }

        const productsFormat = (product) => 
        product.map(({_id,quantity}) => ({
          _id: _id._id,
          quantity,
          name: _id.title,
        }));

        const notProcceedProducts = productsFormat(productsNotBuy);
        const procceedProducts = productsFormat(productsBuy);
        await this.cartService.insertArray(cart._id,notProcceedProducts);
        const updatedCart = await this.cartService.getCartById(cart._id);
        req.user.cart = updatedCart;

        if(productsBuy.length > 0){
          const ticket = await ticketService.createTicket( req.user.email, procceedProducts, productsAmount);
          const purchaseData = {
            ticketId: ticket._id,
            amount: ticket.amount,
            purchaser: ticket.purchaser,
            products: procceedProducts,
            productsNotBuy: notProcceedProducts,
            cartId: cart._id,
          };
          return res.status(200).send({
            status: "success",
            message: "Purchase completed",
            payuload: purchaseData,
          });
        }

        return res.status(200).send({
          status: "error", 
          message: "Products not available", 
          productsNotBuy: notProcceedProducts,
        });
      }
    }
    catch (error) {
      console.log(error);
      res.status(400).send({ status: "error", message: "Error purchasing cart" });
    }
  } 
}
  

export default CartController;
