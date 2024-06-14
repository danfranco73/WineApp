// cart dto

export default class CartDTO {
    constructor(cart) {
        this.id = cart.id;
        this.userId = cart.userId;
        this.productId = cart.productId;
        this.ticketId = cart.ticketId;
        this.quantity = cart.quantity;
    }
}