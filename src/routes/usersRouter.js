import { Router } from "express";
import upload from "../services/utils/utilMulter.js";
import UserService from "../services/userServices.js";
import { checkUser } from "../services/middlewares/auth.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";
import verifyToken from "../services/utils/verifyToken.js";
import { handleRole } from "../services/middlewares/roles.js";

const router = Router();
const userRService = new UserService();

router
  // endpoint to update user role (from premium to user or viceverse) by uid (only if the user logged in is an admin)
  .put("/premium/:uid", verifyToken, handleRole("admin"), async (req, res) => {
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
  )
  .get(
    "/allUsers",
    /* handleRole("admin"), */ async (req, res) => {
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
    }
  )
  // this endpoint will erase the users with no login in the last 2 days, the outcome must inform the number of users deleted with a modal
  .delete(
    "/inactiveUsers",
    /* handleRole("admin"), */ async (req, res) => {
      try {
        const deletedUsersIds = await userRService.deleteInactiveUsers();
        // count the users remaining in the database after deleting the inactive ones to inform the user in the response
        const usersRemaining = await userRService.countUsers();
        // must send a mail to the users deleted
        if (deletedUsersIds.lenght > 0) {
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
          from: `<${config.USER_MAILING}>`,
          to: deletedUsersIds.map(async (userId) => {
            const foundUser = await userRService.getUserById(userId);
            return foundUser.email;
          }),
          subject: "Users deleted",
          html: `
        <div>
        <h1>Users deleted</h1>
        <br>
        <p>Your account has been deleted due to inactivity</p>
        <p> If you wont to Register again, please follow the link below</p>
        <a href="http://localhost:8080/register">Register</a>
        </div>`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
        res.status(200).send({
          status: "success",
          message: `${deletedUsersIds.lenght} users deleted, ${usersRemaining} users remaining`,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error deleting inactive users" });
      }
    }
  );

export default router;
