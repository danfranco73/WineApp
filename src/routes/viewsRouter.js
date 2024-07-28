import { Router } from "express";
import productController from "../controllers/productController.js";
import chatManager from "../dao/managers/chatManager.js";
import { logger } from "../services/utils/logger.js";
import CartService from "../services/cartServices.js";
import UserService from "../services/userServices.js";

const products = new productController();
const user = new UserService();
const router = Router();

const renderWithLayout = (res, view, locals) =>
  res.render(view, { layout: "main", ...locals });

const renderError = (res, redirect = "/login") => {
  res.status(500).redirect(redirect);
};

router
  .get("/", async (req, res) => {
    try {
      const productsData = await products.getProducts().then((data) => {
        return data;
      });
      console.log(productsData.docs);
      renderWithLayout(res, "home", {
        title: "Ecommerce Home",
        products: productsData.docs,
        user: req.session.user,
      });
    } catch (e) {
      renderError(res);
    }
  })

  .get("/login", (req, res) => {
    renderWithLayout(res, "login", {
      title: "Ecommerce Login",
      failLogin: req.session.failLogin ?? false,
      resgisterSuccess: req.session.resgisterSuccess ?? false,
    });
  })

  .get("/register", (req, res) => {
    renderWithLayout(res, "register", {
      title: "Ecommerce Register",
      failRegister: req.session.failRegister ?? false,
    });
  })
  // user profile
  .get("/userProfile", async (req, res) => {
    renderWithLayout(res, "userProfile", {
      title: "Profile",
      user: req.session.user,
    });
  })
  // Restore password (unchanged)
  .post("/restore", (req, res) => {
    renderWithLayout(res, "restore", {
      title: "Ecommerce Restore Password",
      failRestore: req.session.failRestore ?? false,
    });
  })
  // Home page with query params for pagination, sorting, etc.
  .get("/home", async (req, res) => {
    const { page = 1, limit = 10, sort = null, query = {} } = req.query;
    try {
      const productsData = await products.getProducts(req.query);
      console.log(productsData.docs);
      renderWithLayout(res, "home", {
        title: "Product List",
        status: "success",
        products: productsData.docs,
        user: req.session.user,
      });
    } catch (e) {
      renderError(res);
    }
  })

  // Real Time Products with similar logic to index
  .get("/realTimeProducts", async (req, res) => {
    const { page = 1, limit = 10, sort = null, query = {} } = req.query;
    try {
      const productsData = await products.getProducts(req.query);
      renderWithLayout(res, "realTimeProducts", {
        title: "Real-Time Products",
        products: productsData.docs,
        user: req.session.user,
        isValid:
          productsData.page > 0 && productsData.page <= productsData.totalPages,
      });
    } catch (e) {
      renderError(res);
    }
  })
  // Chat page with separate function for fetching messages
  .get("/chat", async (req, res) => {
    try {
      const messages = await chatManager.getMessages();
      renderWithLayout(res, "chat", {
        title: "Chat",
        messages,
      });
    } catch (e) {
      renderError(res);
    }
  })
  // Cart page with similar logic to home
  .get("/cart", async (req, res) => {
    try {
      const cartService = new CartService();
      const cart = await cartService.getCarts(req.session.user);
      renderWithLayout(res, "cart", {
        title: "Cart",
        cart,
      });
    } catch (e) {
      renderError(res);
    }
  })
  // adding a endpoint testin the logger
  .get("/loggerTest", (req, res) => {
    logger.debug("debug");
    logger.http("http");
    logger.info("info");
    logger.warning("warning");
    logger.error("error");
    logger.fatal("fatal");
    res.send("Logger test");
  })

  // askMailforChange
  .get("/askMailforChange", async (req, res) => {
    renderWithLayout(res, "askMailforChange", {
      title: "Ask Mail for Change",
    });
  })

  // upload documents
  .get("/uploadDocuments", async (req, res) => {
    const uid = req.params.uid;
    renderWithLayout(res, "uploadDocuments", {
      title: "Upload Documents",
      uid: req.params.uid,
    });
  })

  // switchRole
  .get("/switchRole", async (req, res) => {
    renderWithLayout(res, "switchRole", {
      title: "Switch Role",
      uid: req.params.uid,
    });
  });

export default router;
