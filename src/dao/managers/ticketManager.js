import ticketService from "../../services/ticketServices.js";

class TicketManager {
  constructor() {
    this.ticketService = ticketService;
  }

  async getTickets() {
    return await this.ticketService.getTickets();
  }

  async getTicketById(id) {
    return await this.ticketService.getTicketById(id);
  }

  async addTicket(ticket) {
    return await this.ticketService.addTicket(ticket);
  }

  async updateTicket(id, ticket) {
    return await this.ticketService.updateTicket(id, ticket);
  }
}

export default TicketManager;