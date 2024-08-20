import TicketDao from "../dao/ticketDAO.js";
import TicketDTO from "../dao/dto/ticketDTO.js";


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

  async createTicket({ purchaser, products }) {
    const code = this.generateTicketCode();
    const ticketData = {
      code,
      purchaseDateTime: new Date(),      
      purchaser,
      products,
    };
    const newTicket = await this.ticketService.createTicket(ticketData);
    return newTicket;
  }
  generateTicketCode() {
    return Math.floor(Math.random() * 1000) + 1;
  }
}

export default TicketService;
