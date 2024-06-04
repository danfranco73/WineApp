// router para un chat

// Path: src/routes/chatRouter.js

import { Router } from "express";
import ChatManager from "../dao/managers/chatManager.js";

const router = Router();

const chatManager = new ChatManager();

router
    .get("/", async (req, res) => {
        try {
        const messages = await chatManager.getMessages();
        res.json(messages);
        } catch (error) {
        console.log(error);
        }
    })
    .post("/", async (req, res) => {
        try {
        const newMessage = await chatManager.addMessage(req.body);
        res.json(newMessage);
        } catch (error) {
        console.log(error);
        }
    })
    .get("/:id", async (req, res) => {
        try {
        const message = await chatManager.getMessageById(req.params.id);
        res.json(message);
        } catch (error) {
        console.log(error);
        }
    })
    .put("/:id", async (req, res) => {
        try {
        const updatedMessage = await chatManager.updateMessage(req.params.id, req.body);
        res.json(updatedMessage);
        } catch (error) {
        console.log(error);
        }
    })
    .delete("/:id", async (req, res) => {
        try {
        const message = await chatManager.deleteMessage(req.params.id);
        res.json(message);
        } catch (error) {
        console.log(error);
        }
    });

export default router;

