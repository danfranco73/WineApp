import ticketServices from "../services/ticketServices.js";

export default class TicketController {
  constructor() {
    this.ticketService = new ticketServices();
  }

  getAllTickets = async (req, res) => {
    try {
      const { limit, page, query, sort } = req.query;
      const tickets = await ticketServices.getAllTickets(
        limit,
        page,
        query,
        sort
      );
      req.logger.info("Tickets found successfully.");
      res.send({ status: "success", payload: tickets });
    } catch (error) {
      req.logger.error("Error fetching tickets:", error.message);
      res
        .status(500)
        .send({ status: "error", message: "Error fetching tickets." });
    }
  };

  getTicketById = async (req, res) => {
    const { id } = req.params;
    try {
      const ticket = await ticketServices.getTicketById(id);
      req.logger.info("Ticket found successfully.");
      res.send({ status: "success", payload: ticket });
    } catch (error) {
      req.logger.error("Error fetching ticket:", error.message);
      res
        .status(500)
        .send({ status: "error", message: "Error fetching ticket." });
    }
  };

  getTicketsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
      const tickets = await ticketServices.getTicketsByUserId(userId);
      req.logger.info("Tickets found successfully.");
      res.send({ status: "success", payload: tickets });
    } catch (error) {
      req.logger.error("Error fetching tickets:", error.message);
      res
        .status(500)
        .send({ status: "error", message: "Error fetching tickets." });
    }
  };

  createTicket = async (req, res) => {
    const { email, amount, products } = req.body;
    try {
      const newTicket = await ticketServices.createTicket({
        email,
        amount,
        products,
      });
      req.logger.info("Ticket created successfully.");
      res.status(201).send({ status: "success", payload: newTicket });
    } catch (error) {
      req.logger.error("Error creating ticket:", error.message);
      res
        .status(500)
        .send({ status: "error", message: "Error creating ticket." });
    }
  };
}
