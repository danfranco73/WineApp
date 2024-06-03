import Ticket from "../dao/models/ticketModel.js";

const ticketService = {
    async getTickets() {
        try{
            const tickets = await Ticket.find();
            return tickets;
        } catch (error) {
            console.log(error);
        }
    },
    async getTicketById(id) {
        try {
            const ticket = await Ticket.findById(id);
            return ticket;
        } catch (error) {
            console.log(error);
        }
    },
    async addTicket(ticket) {
        try {
            const newTicket = new Ticket(ticket);
            await newTicket.save();
            return newTicket;
        } catch (error) {
            console.log(error);
        }
    },
    async updateTicket(id, ticket) {
        try {
            const updatedTicket = await Ticket.findByIdAndUpdate(
                id,
                ticket, {
                    new: true,
                });
            return updatedTicket;
        } catch (error) {
            console.log(error);
        }
    }
}

export default ticketService;