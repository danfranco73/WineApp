import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";


import smsRouter from "./services/utils/sms.js";
import mailingRouter from "./services/utils/mailing.js";
import websocket from "./services/utils/websockets.js";
import uri from "./config/mongoUri.js";
import __dirname from "./services/utils/utils.js";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import initializatePassport from "./config/passportConfig.js";
import sessionRouter from "./routes/sessionsRouter.js";
import mongoSingleton from "./services/middlewares/mongoSingleton.js";
import config from "./config/config.js";
import ticketRouter from "./routes/ticketRouter.js";

// Constants
const PORT = config.PORT;

// App
const app = express();

// Connection to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log(error));
  
mongoSingleton();

// Connection to local port 
const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
// Websockets
const io = new Server(httpServer);
websocket(io);

// Middlewares
app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static("public"))
  .use(cors()) //  CORS enabled for all origins
  // Handlebars
  .engine("handlebars", handlebars.engine())
  .set("views", "./src/views")
  .set("view engine", "handlebars")
  // Session
  .use(cookieParser())
  .use(session({
    store: MongoStore.create({
      mongoUrl: uri,
      ttl: 600,
    }),
    secret: "secretPrhase",
    resave: true,
    saveUninitialized: true
  }));

// Passport 
initializatePassport()
app
  .use(passport.initialize())
  .use(passport.session())

// Routes
app
  .use("/api/products", productsRouter)
  .use("/api/carts", cartsRouter)
  .use("/api/tickets", ticketRouter)
  .use("/", viewsRouter)
  .use("/api/sessions", sessionRouter)
  .use("/api/mailing", mailingRouter)
  .use("/api/sms", smsRouter);