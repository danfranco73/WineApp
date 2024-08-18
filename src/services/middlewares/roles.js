// middlewares for roles checking them for any route (admin user, premium)

import verifyToken from "../utils/verifyToken.js";
import userModel from "../../dao/models/userModel.js";
import ProductService from "../productServices.js";

const productServices = new ProductService();


export const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      // Check if Authorization header exists
      if (!req.headers.authorization) {
        return res
          .status(401)
          .send("Unauthorized: Missing Authorization header");
      }

      // Extract token from header and verify
      const token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = verifyToken(token);
      const user = await userModel.findOne({ email: decoded.email });

      // Check role
      if (roles.includes(user.role)) {
        next();
      } else {
        res.status(403).send("Forbidden");
      }
    } catch (error) {
      res.status(401).send("Unauthorized");
    }
  };
};

// check if role is admin continue otherwise send forbidden
export const isAdmin = async (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
};


// check if role is user
export const isUser = checkRole(["user"]);

// check if role is premium
export const isPremium = checkRole(["premium"]);

// check if the product belongs to the user
export const checkOwnership = async (pid,user) => {
  const { email } = user; // user email
  const product = await productServices.getProductById(pid);
  // console.log(product.owner); ok
  // console.log(email); ok    
  if (product.owner === email) { // check if the product owner is the same as the user email
    return true;
  }
  return false;
};

export const handleRole = (policies) => {
  return async (req, res, next) => {
      if (!req.session.user) {
        console.error("No Authorization!!");        
        return res.status(401).send("Unauthorized product not owned by user");
      }    
    if (policies.includes(req.session.user.role)) {
      next();
    }
  };
};
