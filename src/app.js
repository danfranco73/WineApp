import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import compression from "express-compression";

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
import chatRouter from "./routes/chatRouter.js";
import { userAuth } from "./services/middlewares/auth.js";
import errorHandler from "./services/middlewares/errors/indexErrors.js";
import mockProducts from "./services/middlewares/mockProducts.js";
import {addLogger} from "./services/utils/logger.js";


// Constants
const PORT = config.PORT;

// App
const app = express();

// Connection to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log(error));

mongoSingleton();

// Log memory usage every second
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  console.log(`Memory Usage: ${memoryUsage.rss / 1024 / 1024} MB`);
}, 6000000);


// Connection to local port 
const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
// Websockets
const io = new Server(httpServer);
websocket(io);

// Middlewares
app
  .use(addLogger)
  .use(compression({
    brotli: { enabled: true, zlib: {} }
  }))
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
  .use("/api/sessions", sessionRouter)
  .use("/api/mock", mockProducts)
  .use("/api/products", productsRouter)
  .use("/api/carts", cartsRouter)
  .use("/api/tickets", ticketRouter)
  .use("/", viewsRouter)
  .use("/api/mailing", mailingRouter)
  .use("/api/sms", smsRouter)
  .use("api/chat", userAuth, chatRouter)
  .use(errorHandler);
  