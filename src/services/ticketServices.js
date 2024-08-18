import TicketDao from "../dao/ticketDAO.js";
import TicketDTO from "../dao/dto/ticketDTO.js";
import userModel from "../dao/models/userModel.js";

class TicketService {
  constructor() {
    this.ticketService = new TicketDao();
  }

  async getAllTickets(limit, page, query, sort) {
    const tickets = await this.ticketService.getAllTickets(
      limit,
      page,
      query,
      sort
    );
    return tickets.map((ticket) => new TicketDTO(ticket));
  }

  async getTicketById(ticketId) {
    const ticket = await this.ticketService.getTicketById(ticketId);
    if (!ticket) throw new Error(`Ticket with ID ${ticketId} not found`);
    return new TicketDTO(ticket);
  }

  async getTicketsByUserId(userId) {
    const tickets = await this.ticketService.getTicketsByUserId(userId);
    return tickets.map((ticket) => new TicketDTO(ticket));
  }

  async createTicket(email, amount, products) {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("Purchaser not found");

    const code = this.generateTicketCode();
    const ticketData = {
      code,
      purchaseDateTime: new Date(),
      amount,
      purchaser: email,
      products,
    };
    const newTicket = await this.ticketService.createTicket(ticketData);
    return new TicketDTO(newTicket);
  }
  generateTicketCode() {
    return Math.floor(Math.random() * 1000) + 1;
  }
}

export default TicketService;
