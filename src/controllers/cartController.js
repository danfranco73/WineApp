import CartService from "../services/cartServices.js";

class CartController {
    constructor() {
        this.cartService = new CartService();
    }

    async getCarts() {
        return await this.cartService.getCarts();
    }

    async addCart(cart) {
        return await this.cartService.addCart(cart);
    }

    async getCartById(cid) {
        return await this.cartService.getCartById(cid);
    }

    async updateCart(cid, cart) {
        return await this.cartService.updateCart(cid, cart);
    }

    async deleteCart(cid) {
        return await this.cartService.deleteCart(cid);
    }

    async addProductToCart(cid, pid, quantity) {
        const user = req.session.user;
        const product = await this.productService.getProductById(pid);
        if (user.role === "premium" && product.owner === user.email) {
            throw new Error("You cannot add your own product to your cart");
        }
        return await this.cartService.addProductToCart(cid, pid, quantity);
    }
    
    async deleteProductFromCart(cid, pid) {
        return await this.cartService.deleteProductFromCart(cid, pid);
    }

    async clearCart(cid) {
        return await this.cartService.clearCart(cid);
    }

    async purchaseCart(cid) {
        return await this.cartService.purchaseCart(cid);
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await this.cartService.updateProductQuantity(cid, pid, quantity);
    }
}

export default CartController;
