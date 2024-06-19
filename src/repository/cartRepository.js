import CartDAO from "../dao/cartDAO.js";
import CartDTO from "../dao/dto/cartDTO.js";

export default class CartRepository {
    constructor() {
        this.carts = new CartDAO();
    }

    async getCarts() {
        try {
            return await this.carts.getAll();
        }
        catch (error) {
            console.log(error);
        }
    }

    async addCart(cart) {
        const newCart = new CartDTO(cart);
        try {
            return await this.carts.create(newCart);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCartById(cid) {
        try {
            const cart = await this.carts.getById(cid);
            return cart;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cart = await this.carts.addProduct(cid, pid);
            return cart;
        } catch (error) {
            console.log(error);
        }
    }

    async updateCart(cid, cart) {
        try {
            const updatedCart = await this.carts.update(cid, cart, {
                new: true,
            });
            return updatedCart;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCart(cid) {
        try {
            await this.carts.delete(cid);
        } catch (error) {
            console.log(error);
        }
    }
}