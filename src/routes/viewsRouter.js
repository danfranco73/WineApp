import { Router } from "express";
import { auth, logged , admin } from "../services/middlewares/auth.js";
import productManager from "../dao/managers/ProductsManagerDB.js";
import chatManager from "../dao/managers/chatManager.js";
import {logger} from "../services/utils/logger.js";
import CartService from "../services/cartServices.js";
const products = new productManager();
const router = Router();

 
const renderWithLayout = (res, view, locals) => 
  res.render(view, { layout: "main", style: "style.css", ...locals });

const renderError = (res, redirect = "/login") => {
  res.status(500).redirect
    (redirect);
};

router
  // Index with auth middleware
  .get("/", auth, async (req, res) => {
    try {
      const productsData = await products.getProducts();
      renderWithLayout(res, "index", {
        title: "Ecommerce Users",
        products: productsData.docs,
        user: req.session.user,
        isValid: productsData.page > 0 && productsData.page <= productsData.totalPages,
      });
    } catch (e) {
      renderError(res);
    }
  })
  // Login with logged middleware (presumably checks if logged in)
  .get("/login", logged, (req, res) => {
    renderWithLayout(res, "login", {
      title: "Ecommerce Login",
      failLogin: req.session.failLogin ?? false,
      resgisterSuccess: req.session.resgisterSuccess ?? false,
    });
  })
  // Register with no middleware
  .get("/register", (req, res) => {
    renderWithLayout(res, "register", {
      title: "Ecommerce Register",
      failRegister: req.session.failRegister ?? false,
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
    const { page, limit, sort, query } = req.query;
    try {
      const productsData = await products.getProducts(page, limit, sort, query);
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
  .get("/realTimeProducts", admin, async (req, res) => {
    try {
      const productsData = await products.getProducts();
      renderWithLayout(res, "realTimeProducts", {
        title: "Real Time Products",
        products: productsData.docs,
        isValid: productsData.page > 0 && productsData.page <= productsData.totalPages,
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
      const cart = await cartService.getCart(req.session.user);
      renderWithLayout(res, "cart", {
        title: "Cart",
        cart,
      });
    } catch (e) {
      renderError(res);
    }
  })
  // adding a endpoint testin the logger
  .get('/loggerTest', (req, res) => {
    logger.debug('debug');
    logger.http('http');
    logger.info('info');
    logger.warning('warning');
    logger.error('error');
    logger.fatal('fatal');
    res.send('Logger test');
});

export default router;
