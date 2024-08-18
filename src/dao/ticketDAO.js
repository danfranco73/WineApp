import TicketRepository from "../repository/ticketsRepository.js";
class TicketDao {
  constructor() {
    this.ticketDao = new TicketRepository();
  }

  async getAllTickets(limit, page, query, sort) {
    return await this.ticketDao.getAllTickets(limit, page, query, sort);
  }

  async getTicketById(ticketId) {
    return await this.ticketDao.getTicketById(ticketId);
  }

  async getTicketsByUserId(userId) {
    return await this.ticketDao.getTicketsByUserId(userId);
  }

  async createTicket(ticketData) {
    return await this.ticketDao.createTicket(ticketData);
  }
}

export default TicketDao;
