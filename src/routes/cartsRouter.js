import { Router } from "express";
import CartController from "../controllers/cartController.js";
import verifyToken from "../services/utils/verifyToken.js";
import {
  handleRole,
  checkRole,
  checkOwnership,
} from "../services/middlewares/roles.js";
import {
  userAuth,
  auth,
  isNotAdmin,
  admin,
} from "../services/middlewares/auth.js";
import ticketService from "../services/ticketServices.js";
import productServices from "../services/productServices.js";

const cartManager = new CartController();
const productService = new productServices();

const router = Router();

// get the carts from the database in my ecommerce mongodb
router
  .get("/", async (req, res) => {
    const carts = await cartManager.getCarts();
    return res.status(200).send({
      status: "success",
      message: "Carts retrieved",
      payload: carts,
    });
  })

  // add a new cart
  .post("/", async (req, res) => {
    const products = req.body.products;
    const newCart = await cartManager.addCart(products);
    return res.send({
      status: "success",
      payload: newCart,
    });
  })

  // update a cart adding a product with pid if user is not admin
  .put("/:cid/product/:pid", async (req, res) => {
    const user = req.session.user;
     
    if (!user) {
      return res.status(401).send({
        status: "error",
        message: "Unauthorized No user",
      });
    }
    // get the cid from the user session and the pid from the product id
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(cid, pid);
    return res.send({
      status: "success",
      payload: cart,
    });
  })

  // getting cart by cid in the database in my ecommerce mongodb
  .get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    return res.send({
      status: "success",
      payload: cart,
    });
  })

  // delete a cart by id
  .delete("/:cid", async (req, res) => {
    const id = req.params.cid;
    cartDeleted = await cartManager.deleteCart(id);
    return res.send({
      status: "success",
      message: "Cart deleted",
      payload: cartDeleted,
    });
  })

  // Delete a product in my cart
  .delete("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await cartManager.deleteProductFromCart(cid, pid);
    return res.send({
      status: "success",
      payload: cart,
    });
  })

  // clear the cart by cid in the database in my ecommerce mongodb
  .delete("/:cid/clear", async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.clearCart(cid);
    return res.send({
      status: "success",
      payload: cart,
    });
  })

  // update product quantity in a cart
  .put("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
    return res.send({
      status: "success",
      payload: cart,
    });
  })

  // purchase the cart
  .get("/:cid/purchase", async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.purchaseCart(cid);
    return res.send({
      status: "success",
      payload: cart,
    });
  });

export default router;
