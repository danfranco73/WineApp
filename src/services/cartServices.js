import cartModel from "../dao/models/cartModel.js";
import ProductService from "./productServices.js";
import ticketService from "./ticketServices.js";

const productService = new ProductService();

export default class CartService {
    constructor() {
        this.carts = cartModel;
    }
    // getting all the carts from the database in my ecommerce mongodb
    async getCarts() {
        try {
            const carts = await this.carts.find().populate("products.product");
            return carts;
        } catch (error) {
            console.log(error);
        }
    }
    // adding a new cart to the database in my ecommerce mongodb
    async addCart(cart) {
        try {
            const newCart = new this.carts(cart);
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log(error);
        }
    }

    // updating a cart in the database 
    async updateCart(id, cart) {
        try {
            const updatedCart = await this.carts.findByIdAndUpdate(
                id,
                cart, {
                new: true,
            });
            return updatedCart;
        } catch (error) {
            console.log(error);
        }
    }
    // deleting a cart in the database in my ecommerce mongodb
    async deleteCart(id) {
        try {
            await this.carts.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
        }
    }
    // getting a cart by id in the database in my ecommerce mongodb
    async getCartById(id) {
        try {
            const cart = await this.carts
                .findById(id)
                .populate("products.product") // not working
                .lean();
            return cart;
        } catch (error) {
            console.log(error);
        }
    }
    // adding a product by pid into a cart by cid 
    async addProductToCart(cid, pid) {
        try {
            const cart = await this.carts.findById(cid);
            const product = await productService.getProductById(pid);
            if (product === null) {
                return null;
            }
            const productIndex = cart.products.findIndex((p) => p.product._id == pid);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
                await this.updateCart(cid, cart);
                return cart;
            }
            cart.products.push({ product: product, quantity: 1 });
            await this.updateCart(cid, cart);
            return cart;
        }
        catch (error) {
            console.log(error);
        }
    }
    // deletea cart by id in the database in my ecommerce mongodb
    async deleteCart(_id) {
        try {
            await this.carts.findByIdAndDelete(_id);
        } catch (error) {
            console.log(error);
        }
    }
    // delete a product in my cart 
    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);
            const productIndex = cart.products.findIndex((p) => p._id == pid);
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
            }
            await this.updateCart(cid, cart);
            return cart;
        } catch (error) {
            console.log(error);
        }
    }
    // check if the product has enough stock to be added to the cart and substract from it , if it doesn't have enough stock, it will not be added to the cart
    async purchaseCart(cid) {
        try {
            const cart = await cartModel.findById(cid);
            const products = cart.products;
            const productsNotPurchased = [];
            for (const product of products) {
                const stock = product.product.stock;
                if (stock < product.quantity) {
                    productsNotPurchased.push(product.product._id);
                } else {
                    product.product.stock -= product.quantity;
                    await productService.updateProduct(product.product._id, product.product);
                }
            }
            const ticket = {
                code: Math.random().toString(36).slice(2, 9),
                amount: cart.products.reduce((acc, p) => acc + p.product.price * p.quantity, 0),
                purchaser: cart.user,
                cart: cart,
            };
            await ticketService.addTicket(ticket);
            cart.products = cart.products.filter((p) => productsNotPurchased.includes(p.product._id));
            await this.updateCart(cid, cart);
            return productsNotPurchased;
        } catch (error) {
            console.log(error);
        }
    }

    // update the quantity of a product in a cart
    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await cartModel.findById(cid);
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
    // clear all products from a cart
    async clearCart(cid) {
        try {
            const cart = await cartModel.findById(cid);
            cart.products = [];
            await this.updateCart(cid, cart);
            return cart;
        } catch (error) {
            console.log(error);
        }
    }
}

