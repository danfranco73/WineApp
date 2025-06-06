import { Router } from "express";
import upload from "../services/utils/utilMulter.js";
import UserService from "../services/userServices.js";
import { admin} from "../services/middlewares/auth.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";

const router = Router();
const userRService = new UserService();

router
  // endpoint to update user role (from premium to user or viceverse) by uid (only if the user logged in is an admin)
  .put("/premium/:uid", admin,async (req, res) => {
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
  })
  // endpoint to upload documents by uid using multer and the userModel 
  .post(
    "/:uid/documents",
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
  )
  .get("/allUsers", admin,async (req, res) => {
    try {
      const users = await userRService.getAllUsers();
      res.status(200).send({
        status: "success",
        users: users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Error getting users" });
    }
  })
  // Delete inactive users and send an email to each one
  .delete("/inactiveUsers", admin, async (req, res) => {
    try {
      // get the inactive users
      const inactiveUsers = await userRService.getInactiveUsers();
      console.log(inactiveUsers);
      // for each inactive user, send an email
      inactiveUsers.forEach(async (user) => {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          service: "gmail",
          port: 587,
          secure: false,
          tls: {
            rejectUnauthorized: false,
          },
          auth: {
            user: config.USER_MAILING,
            pass: config.USER_MAILING_PASS,
          },
        });
        const mailOptions = {
          from: `Admin <${config.USER_MAILING}>`,
          to: user.email,
          subject: "Account deleted",
          text: "Your account has been deleted due to inactivity",
        };
        await transporter.sendMail(mailOptions),
          async (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          };
      });
      // delete the inactive users
      const deletedUserIds = await userRService.deleteInactiveUsers();
      res.status(200).send({
        status: "success",
        message: "Inactive users deleted",
        deletedUserIds: deletedUserIds,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Error deleting inactive users" });
    }
  });

export default router;
