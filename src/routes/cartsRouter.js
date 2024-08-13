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
  // get cart by user id (Othe one that is logged in)ß
  .get("/user", auth, async (req, res) => {
    const user = req.session.user;
    const uid = user._id;
    const cart = await cartManager.getCartByUserId(uid);
    console.log(cart);

    return res.send({
      status: "success",
      payload: cart,
    });
  })

  // add a new cart
  .post("/", async (req, res) => {
    const uid = req.session.user;
    const newCart = await cartManager.addCart(uid);
    return res.send({
      status: "success",
      payload: newCart,
    });
  })

  // update a cart adding a product with pid if user is not admin
  .put("/:cid/product/:pid", auth, async (req, res) => {
    const { cid, pid } = req.params;
    const user = req.session.user;
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

  // router to finish the purchase of a cart by cid in the database on ly if the user is authenticated and is the cart owner
  .patch("/:cid/purchase", userAuth, async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.purchaseCart(cid, req.session.user);
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
  });

export default router;
