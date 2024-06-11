// ticket dto

export default class TicketDTO {
    constructor(ticket) {
        this.id = ticket.id;
        this.name = ticket.name;
        this.price = ticket.price;
        this.quantity = ticket.quantity;
    }
}
