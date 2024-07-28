import { Router } from "express";
import upload from "../services/utils/utilMulter.js";
import UserService from "../services/userServices.js";
import { checkUser } from "../services/middlewares/auth.js";
import verifyToken from "../services/utils/verifyToken.js";
import { handleRole } from "../services/middlewares/roles.js";

const router = Router();
const userRService = new UserService();

router
  // endpoint to update user role (from premium to user or viceverse) by uid (only if the user logged in is an admin)
  .put(
    "/premium/:uid",
    /*  verifyToken, handleRole("admin"), */ async (req, res) => {
      try {
        const uid = req.params.uid;
        const user = await userRService.getUserById(uid);
        if (user.role === "user" && !user.documents) {
          return res.status(400).send({
            status: "error",
            message: "User must upload documents to become premium",
          });
        }
        user.role = user.role === "user" ? "premium" : "user";
        const updatedUser = await userRService.updateUser(user._id, user);
        res.status(200).send({
          status: "success",
          user: updatedUser,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating user role" });
      }
    }
  )
  // endpoint to upload documents by uid
  .post(
    "/:uid/documents",
    /*     verifyToken,
    checkUser, */
    upload.array("files"),
    async (req, res) => {
      try {
        const user = await userRService.getUserById(req.params.uid);
        if (!user) {
          return res.status(404).send({
            status: "error",
            message: "User not found",
          });
        }
        const documents = req.files.map((file) => {
          return {
            name: file.originalname,
            reference: file.filename,
          };
        });
        user.documents = documents;
        const updatedUser = await userRService.updateUser(user._id, user);
        res.status(200).send({
          status: "success",
          user: updatedUser,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error uploading documents" });
      }
    }
  );
export default router;
