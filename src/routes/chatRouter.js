// router para un chat

// Path: src/routes/chatRouter.js

import { Router } from "express";
import { auth, logged , admin , userAuth} from "../services/middlewares/auth.js";
import { getMessages } from "../dao/managers/ChatManagerDB.js"; // Assuming chatManager exists

const router = Router();

