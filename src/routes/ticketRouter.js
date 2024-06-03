import { Router } from "express";
import TicketManager from "../dao/managers/ticketManager.js";

const ticketManager = new TicketManager();

const router = Router();

router.get("/", async (req, res) => {
    const tickets = await ticketManager.getTickets();
    res.send({
        status: "success",
        payload: tickets,
    });
    });
// add a new ticket
router.post("/", async (req, res) => {
    const ticket = req.body;
    const newTicket = await ticketManager.addTicket(ticket);
    res.send({
        status: "success",
        payload: newTicket,
    });
});
// get a ticket by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const ticket = await ticketManager.getTicketById(id);
    res.send({
        status: "success",
        payload: ticket,
    });
});
// 
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const ticket = req.body;
    const updatedTicket = await ticketManager.updateTicket(id, ticket);
    res.send({
        status: "success",
        payload: updatedTicket,
    });
});

export default router;