// cart dto
export default class CartDTO {
    constructor(cart) {
        this._id = cart.id;
        this.user = cart.user || null;
        this.products = cart.products || [];
        this.quantity = cart.quantity || 0;
    }
}