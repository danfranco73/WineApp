import ticketModel from "../dao/models/ticketModel.js";


export default class TicketRepository {
  async getAllTickets(limit, page, query, sort) {
    return await ticketModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort)
      .populate("purchaser")
      .populate("products._id")
      .lean();
  }

  async getTicketById(ticketId) {
    return await ticketModel.findById(ticketId).populate("purchaser").populate("products._id").lean();
  }

  async getTicketsByUserId(userId) {
    return await ticketModel.find({ purchaser: userId }).populate("purchaser").populate("products._id").lean();
  }

  async createTicket(ticket) {
    return await ticketModel.create(ticket);
  }
}
