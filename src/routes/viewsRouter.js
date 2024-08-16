import { Router } from "express";
import chatManager from "../dao/managers/chatManager.js";
import { logger } from "../services/utils/logger.js";
import CartService from "../services/cartServices.js";
import UserService from "../services/userServices.js";
import ProductController from "../controllers/productController.js";
import { isAdmin } from "../services/middlewares/roles.js";
import cartModel from "../dao/models/cartModel.js";
import productModel from "../dao/models/productModel.js";

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
      // need to pass tha cart id in the user model to the view
      const productsData = await products.getProducts();
      if (!productsData) {
        return res.status(404).send("No products found");
      }
      const cart = await cartModel.findOne({ user: req.session.user._id });
      renderWithLayout(res, "home", {
        title: "Product List",
        status: "success",
        products: productsData,
        cart,
        user: req.session.user,
      });
    } catch (e) {
      renderError(res);
    }
  })
  .get("/cart", async (req, res) => {
    const cart = await cartModel.findOne({ user: req.session.user._id });
    if(!user){
      return res.status(404).send("No user found").redirect("/login");
    }
    if (!cart) {
      const newCart = await cartService.addCart();
      const user = await user.getUserById(req.session.user._id);
      user.cart = newCart._id;
      await user.save();
      cart = await cartModel.findOne({ user: req.session.user._id });
    }
    // need to pass tha quantity of the products in the cart
    const products = await productModel.find({
      _id: { $in: cart.products },
    });
    const totalQuantity = await cartService.getTotalQuantityInCart(cart._id);
    const totalAmount = await cartService.amountEachProductInCart(cart._id);
    console.log(totalAmount, totalQuantity);
    
    renderWithLayout(res, "cart", {
      title: "Cart",
      cart,
      user: req.session.user,
      products: products,
      totalQuantity,
      totalAmount,
    });
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
  });

export default router;
