// src/services/middlewares/auth.js
import CartService from "../cartServices.js";
import verifyToken from "../utils/verifyToken.js";
import userModel from "../../dao/models/userModel.js";

const cartService = new CartService();

// check if the user is logged and if it is, continue, otherwise alert yo need to log in
const auth = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.session.user
      ._id)
      .populate("cart");    
    if (!user) {
      return res.status(401).send("Unauthorized No User");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized error");
  }
};


// check if the user is logged and if it is, continue, otherwise alert yo need to log in
const logged = function (req, res, next) {
  if (!req.session.user) {
    return res.status(401).send("You need to log in to perform this action.");
  }
  return next();
}
// VERIFICO QUE EL UID ES EL MISMO QUE ESTA LOGGEDO
const checkUser = function (req, res, next) {
  if (req.session.user._id !== req.params.uid) {
    return res
      .status(403)
      .send("You don't have permission to perform this action.");
  }
  next();
};

// Only the admin can access the admin panel
const admin = function (req, res, next) {
  if (req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
};
// if the user is admin cannot acces to the user panel
const isNotAdmin = function (req, res, next) {
  // check if user is logged
  if (!req.session || !req.session.user) {
    return res
      .status(401)
      .send("You must be logged in to perform this action.");
  }
  // check if user is admin
  if (req.session.user.role === "admin") {
    return res
      .status(403)
      .send("You don't have permission to perform this action.");
  }
  next();
};

const userAuth = function (req, res, next) {
  console.log(req.session.user.role);
  if (req.session.user.role !== "user") {
    return res
      .status(403)
      .send("You don't have permission to perform this action.");
  }
  if (!req.session.user) {
    return res
      .status(401)
      .send("You must be logged in to perform this action.");
  }
  req.user = req.session.user;
  next();
};

export { auth, logged, admin, userAuth, isNotAdmin, checkUser };
