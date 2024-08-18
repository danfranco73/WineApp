import { Router } from "express";
import TicketController from "../controllers/ticketController.js";

const ticketRouter = Router();
const ticketController = new TicketController();

ticketRouter.get("/", ticketController.getAllTickets);
ticketRouter.get("/:id", ticketController.getTicketById);
ticketRouter.get("/user/:userId", ticketController.getTicketsByUserId);
ticketRouter.post("/", ticketController.createTicket);

export default ticketRouter;