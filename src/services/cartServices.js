import CartRepository from "../dao/repository/cartRepository.js";
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
            const carts = await this.carts.getCarts();
            return carts;
        } catch (error) {
            console.log(error);
        }
    }
    // adding a new cart to the database in my ecommerce mongodb
    async addCart(cart) {
        try {
            const newCart = await this.carts.addCart(cart);
            return newCart;
        } catch (error) {
            console.log(error);
        }
    }

    // updating a cart in the database 
    async updateCart(cid, cart) {
        try {
            const updatedCart = await this.carts.updateCart(cid, cart);
            return updatedCart;
        } catch (error) {
            console.log(error);
        }
    }
    // deleting a cart in the database in my ecommerce mongodb
    async deleteCart(cid) {
        try {
            await this.carts.deleteCart(cid);
        } catch (error) {
            console.log(error);
        }
    }
    // getting a cart by id in the database in my ecommerce mongodb
    async getCartById(cid) {
        try {
            const cart = await this.carts.getCartById(cid);
            return cart;
        } catch (error) {
            console.log(error);
        }
    }
    // adding a product to a cart
    async addProductToCart(cid, pid, quantity) {
        try{
            const cart = await this.carts.addProductToCart(cid, pid, quantity);
            return cart;
        } catch (error) {
            console.log(error);
        }       
    }

    // delete a product in my cart 
    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await this.carts.deleteProductFromCart(cid, pid);
            return cart;
        } catch (error) {
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
        }
    }
}

