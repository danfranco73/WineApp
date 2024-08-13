import { Router } from "express";
import chatManager from "../dao/managers/chatManager.js";
import { logger } from "../services/utils/logger.js";
import CartService from "../services/cartServices.js";
import UserService from "../services/userServices.js";
import ProductController from "../controllers/productController.js";
import { isAdmin } from "../services/middlewares/roles.js";
import cartModel from "../dao/models/cartModel.js";

const cartService = new CartService();

const products = new ProductController();
const user = new UserService();
const router = Router();

// Utilities for rendering views
const renderWithLayout = (res, view, locals) =>
  res.render(view, { layout: "main", ...locals });

const renderError = (res, redirect = "/login") => {
  res.status(500).redirect(redirect);
};

// Views router
router
  .get("/", async (req, res) => {
    renderWithLayout(res, "welcome", {
      title: "WineAPP",
      status: "success",
    });
  })
  // Home page with product list and user session data (unchanged)
  .get("/home", async (req, res) => {
    try {
      const productsData = await products.getProducts();
      console.log(productsData);
      renderWithLayout(res, "home", {
        title: "Product List",
        status: "success",
        products: productsData,
        user: req.session.user,
      });
    } catch (e) {
      renderError(res);
    }
  })
  
  .get("/cart", async (req, res) => {
    try {
      const cart = await cartService.getCartWithUser(req.session.user._id);
      const cartId = cart._id;
      const cartProducts = await cartModel.findById(cartId).populate({
        path: "products.cpid",
        model: "products",
      }).lean();

      renderWithLayout(res, "cart", {
        title: "Cart",
        status: "success",
        cart,
        cartProducts,
        user: req.session.user,
      });
    } catch (e) {
      renderError(res);
    }
  })

  .get("/realTimeProducts", async (req, res) => {
    try {
      const productsData = await products.getProducts();
      console.log(productsData);
      renderWithLayout(res, "realTimeProducts", {
        title: "Real Time Products",
        status: "success",
        products: productsData,
        user: req.session.user,
      });
    } catch (e) {
      renderError(res);
    }
  })

  .get("/index", async (req, res) => {
    try {
      const productsData = await products.getProducts();
      console.log(productsData);
      renderWithLayout(res, "index", {
        title: "Product List",
        status: "success",
        products: productsData.docs,
        user: req.session.user,
      });
    } catch (e) {
      renderError(res);
    }
  })

  //  show the products
  .get("/products", async (req, res) => {
    try {
      const productsData = await products.getProducts();
      console.log(productsData);
      renderWithLayout(res, "product", {
        title: "Product List",
        status: "success",
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
  // user Admin profile
  .get(
    "/adminProfile",
    /* isAdmin, */ async (req, res) => {
      renderWithLayout(res, "adminProfile", {
        title: "Admin Profile",
        user: req.session.user,
      });
    }
  )

  // Restore password (unchanged)
  .post("/restore", (req, res) => {
    renderWithLayout(res, "restore", {
      title: "Ecommerce Restore Password",
      failRestore: req.session.failRestore ?? false,
    });
  })

  // Product detail page with similar logic to home
  .get("/product/:id", async (req, res) => {
    try {
      const product = await products.getProducts(req.params.id);
      renderWithLayout(res, "product", {
        title: product.name,
        product,
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
  .get("/switchRole", isAdmin, async (req, res) => {
    renderWithLayout(res, "switchRole", {
      title: "Switch Role",
      uid: req.params.uid,
    });
  })
  // show all users
  .get("/allUsers", isAdmin, async (req, res) => {
    const users = await user.getAllUsers();
    renderWithLayout(res, "users", {
      title: "All Users",
      users: users,
    });
  })
  

export default router;
