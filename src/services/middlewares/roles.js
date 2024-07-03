// middlewares for roles checking them for any route (admin user, premium)

import verifyToken from "../utils/verifyToken.js";
import userModel from "../../dao/models/userModel.js";

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
export const isAdmin = checkRole(["admin"]);

// check if role is user
export const isUser = checkRole(["user"]);

// check if role is premium
export const isPremium = checkRole(["premium"]);

export const checkOwnership = async (pid, email) => {
  const product = await manager.getById(pid);
  if (!product) return false;
  return product.owner === email;
};

export const handleRole = (policies) => {
  return async (req, res, next) => {
    console.log(req.user);
    if (!req.user) return res.status(401).send("Unauthorized");
    if (policies.includes(req.user.role)) {
      next();
    }
  };
};
