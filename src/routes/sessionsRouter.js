import { Router } from "express";
import passport from "passport";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

import UserService from "../services/userServices.js";
import config from "../config/config.js";
import verifyToken from "../services/utils/verifyToken.js";
import { handleRole } from "../services/middlewares/roles.js";

const router = Router();
const sessionService = new UserService();
router
  // github login and return user
  .get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    (req, res) => {
      res.send({
        status: "success",
        message: "Success",
      });
    }
  )
  // github callback and return user
  .get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    (req, res) => {
      req.session.user = req.user;
      res.redirect("/");
    }
  )
  // logout and destroy session and redirect to login and show message and delet cookie
  .get("/logout", (req, res) => {
    req.session.destroy();
    console.log("User logged out");
    res.clearCookie("jwt");
    res.redirect("/login");
  })

  // register new user
  .post("/register", async (req, res) => {
    try {
      req.session.failRegister = false;
      const user = await sessionService.register(req.body);
      console.log("User registered correctly", user);
      res.status(201).redirect("/login");
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Error registering user",
      });
    }
  })
  // login and create session and redirect to home
  .post("/login", async (req, res) => {
    try {
      const user = await sessionService.login(
        req.body.email,
        req.body.password
      );
      if (!user) {
        req.session.failLogin = true;
        console.error("User invalid credentials ");
        return res.redirect("/login");
      }
      console.log("User logged in correctly", user);
      req.session.user = user; // save user in session
      if (user.role === "admin" || user.role === "premium") {
        return res
          .cookie("jwt", user.token, { httpOnly: true, maxAge: 3600000 }) // 1 hour
          .status(200)
          .redirect("/realTimeProducts");
      }
      return res
        .cookie("jwt", user.token, { httpOnly: true, maxAge: 3600000 }) // 1 hour
        .status(200)
        .redirect("/");
    } catch (error) {
      req.session.failLogin = true;
      console.error(error.message);
      res.redirect("/login");
    }
  })
  // "current" endpoint to get the current user only if it is logged in (admin is allowed to see all users)
  .get("/current", (req, res) => {
    const user = req.session.user;
    if (!user) return res.sendStatus(401);
    if (user.role === "admin") {
      return res.json({
        status: "User is admin",
        user: user,
      });
    } else {
      const userDTO = {
        email: user.email,
        uid: user._id,
        name: user.first_name,
        surname: user.last_name,
        role: user.role,
      };
      return res.json({
        status: "User is not admin",
        user: userDTO,
      });
    }
  })

  // get user by id
  .get("/:uid", async (req, res) => {
    const user = await sessionService.getUserById(req.params.uid);
    if (!user) return res.sendStatus(404);
    console.log("User found");
    res.send({
      status: "success",
      user: user,
    });
  })
  // endpoint to update user role (from premium to user or viceverse) by uid (only if the user logged in is an admin)
  .put(
    "/premium/:uid",
    verifyToken,
    handleRole(["admin"]),
    async (req, res) => {
      try {
        const uid = req.params.uid;
        const user = await sessionService.getUserById(uid);
        user.role = user.role === "premium" ? "user" : "premium";
        const updatedUser = await sessionService.updateUser(user._id, user);
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

  // endpoint for password reset and send email with token
  .post("/forgotPassword", async (req, res) => {
    try {
      const userMail = await sessionService.getUserByEmail(req.body.email);
      if (!userMail) {
        return res.status(404).send({
          status: "error",
          message: "User not found",
        });
      }
      const token = sessionService.forgotPassword(userMail.email);
     
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
        to: userMail.email,
        subject: "Reset password",
        html: ` <div>
                <h1>Reset password</h1>
                <br>
                <p>Click on the link below to reset your password</p>
                <a href="http://localhost:8080/api/sessions/resetPassword/${userMail.resetPasswordToken}">Reset password</a>
                </div> `,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.send({
            status: "success",
            message: "Email sent",
          });
        }
      });
      res.render("askMailforChange", { success: true });
    } catch (error) {
      console.error(error.message);
      res.send({
        status: "error",
        message: "Error sending email",
      });
    }
  })
  // reset password endpoint
  .get("/resetPassword/:token", verifyToken, async (req, res) => {
    try {
      const user = await sessionService.getUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).send({
          status: "error",
          message: "User or token not invalid",
        });
      }
      res.render("resetPassword", { token: req.params.token });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: "error",
        message: "Error resetting password",
      });
    }
  });

export default router;
