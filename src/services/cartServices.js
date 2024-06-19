import CartRepository from "../repository/cartRepository.js";
import ProductService from "./productServices.js";
import ticketService from "./ticketServices.js";

const productService = new ProductService();

export default class CartService {
    constructor() {
        this.carts = new CartRepository();
    }
    // getting all the carts from the database in my ecommerce mongodb
    async getCarts() {
        try {
            return await this.carts.getCarts();
        } catch (error) {
            next(error);
        }
    }
    // adding a new cart to the database in my ecommerce mongodb
    async addCart(cart) {
        try {
            return await this.carts.addCart(cart);
        } catch (error) {
            next(error);
        }
    }
    // updating a cart in the database 
    async updateCart(cid, cart) {
        try {
            return await this.carts.updateCart(cid, cart);
        } catch (error) {
            next(error);
        }
    }
    // deleting a cart in the database in my ecommerce mongodb
    async deleteCart(cid) {
        try {
            return await this.carts.deleteCart(cid);
        } catch (error) {
            next(error);
        }
    }
    // getting a cart by id in the database in my ecommerce mongodb
    async getCartById(cid) {
        try {
            return await this.carts.getCartById(cid);
        } catch (error) {
            next(error);
        }
    }
    // adding a product to a cart
    async addProductToCart(cid, pid, quantity) {
        try {
            return await this.carts.addProductToCart(cid, pid, quantity);
        } catch (error) {
            next(error);
        }
    }
    // delete a product in my cart 
    async deleteProductFromCart(cid, pid) {
        try {
            return await this.carts.deleteProductFromCart(cid, pid);
        } catch (error) {
            next(error);
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
            next(error);
        }
    }
    // check if the product has enough stock to be added to the cart and substract from it , if it doesn't have enough stock, it will not be added to the cart. finally, it will create a ticket with the products that were not purchased and clear the cart
    async purchaseCart(cid) {
        try {
            const cart = await this.carts.getCartById(cid);
            const products = cart.products;
            const productsToBuy = [];
            const productsNotToBuy = [];
            for (const product of products) {
                const stock = product.product.stock;
                if (stock >= product.quantity) {
                    product.product.stock -= product.quantity;
                    productsToBuy.push(product);
                } else {
                    productsNotToBuy.push(product);
                }
            }
            await ticketService.addTicket({
                products: productsNotToBuy,
                Amount: productsToBuy.reduce((acc, p) => acc + p.product.price * p.quantity, 0),
            });
            await this.clearCart(cid);
            return productsToBuy;
        } catch (error) {
            next(error);
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
            next(error);
        }
    }
}

