import { Router } from "express";
import CartController from "../controllers/cartController.js";
import { auth } from "../services/middlewares/auth.js";
import { userAuth, isNotAdmin, admin } from "../services/middlewares/auth.js";

const cartManager = new CartController();

const router = Router();

// get the carts from the database in my ecommerce mongodb
router
  .get("/", async (req, res) => {
    const carts = await cartManager.getCarts();
    res.send({
      status: "success",
      payload: carts,
    });
  })

  // add a new cart
  .post("/", async (req, res) => {
    const cart = req.body;
    const purchaser = req.session.user;
    const newCart = await cartManager.addCart(cart);
    res.send({
      status: "success",
      purchaser: purchaser,
      payload: newCart,
    });
  })

  // update a cart adding a product with pid if user is not admin 
  .put("/:cid/product/:pid", isNotAdmin, async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(cid, pid);
    res.send({
      status: "success",
      payload: cart,
    });
  })

  // modify quantity of a product in a cart by cid and pid in the database in my ecommerce mongodb
  .patch("/:cid/product/:pid", userAuth, async (req, res) => {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity;
    const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.send({
      status: "success",
      payload: cart,
    });
  })

  // getting cart by cid in the database in my ecommerce mongodb
  .get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    res.send({
      status: "success",
      payload: cart,
    });
  })

  // router to finish the purchase of a cart by cid in the database on ly if the user is authenticated and is the cart owner
  .patch("/:cid/purchase"/* , userAuth */, async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.purchaseCart(cid, req.session.user);
    res.send({
      status: "success",
      payload: cart,
    });
  })

  // delete a cart by id 
  .delete("/:cid", async (req, res) => {
    const id = req.params.cid;
    await cartManager.deleteCart(id);
    res.send({
      status: "success",
      message: "Cart deleted",
    });
  })

  // Delete a product in my cart
  .delete("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await cartManager.deleteProductFromCart(cid, pid);
    res.send({
      status: "success",
      payload: cart,
    });
  })

  // clear the cart by cid in the database in my ecommerce mongodb
  .delete("/:cid/clear", async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.clearCart(cid);
    res.send({
      status: "success",
      payload: cart,
    });
  });


export default router;
