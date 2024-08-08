import { Router } from "express";
import passport from "passport";
import nodemailer from "nodemailer";
import upload from "../services/utils/utilMulter.js";
import jwt from "jsonwebtoken";
import UserService from "../services/userServices.js";
import config from "../config/config.js";
import verifyToken from "../services/utils/verifyToken.js";
import { handleRole } from "../services/middlewares/roles.js";
import CartController from "../controllers/cartController.js";

const cartManager = new CartController();

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
        message: "Correctly authenticated with github",
      });
    }
  )
  // github callback and return user
  .get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    (req, res) => {
      req.session.user = req.user;
      res.redirect("/home");
    }
  )
  // logout and destroy session and redirect to login and show message and delet cookie
  .get("/logout", (req, res) => {
    req.session.destroy();
    res.clearCookie("jwt");
    res.redirect("/login");
  })

  // register new user
  .post("/register", async (req, res) => {
    try {
      const { email, password, ...rest } = req.body;
      const userExists = await sessionService.getUserByEmail(email);
      if (userExists) {
        req.session.failRegister = true;
        Alert("User already exists");
        return res.redirect("/register");
      }
      req.session.failRegister = false;
      const user = await sessionService.register(req.body);
      // create a cart for the user
      const cartId = await cartManager.createCart(user._id);
      console.log("Cart created for user", cartId);
      console.log("User registered correctly", user);
      res.status(200).redirect("/login");
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Error registering user",
      });
    }
  })
  // login and create session and redirect to home
  .post("/login", async (req, res) => {
    // prevent default login when update page
    if (!req.body.email || !req.body.password) {
      return res.redirect("/login");
    }
    try {
      const user = await sessionService.login(
        req.body.email,
        req.body.password
      );
      if (!user) {
        req.session.failLogin = true;
        console.error("User invalid credentials NO TOKEN ");
        return res.redirect("/login");
      }
      console.log("User logged in correctly", user);
      req.session.user = user; // save user in session
      if (user.role === "admin" || user.role === "premium") {
        return res
          .cookie("jwt", user.token, {
            httpOnly: true,
            maxAge: 3600000,
            secure: true,
          }) // 1 hour
          .status(200)
          .redirect("/realTimeProducts");
      }
      return res
        .cookie("jwt", user.token, {
          httpOnly: true,
          maxAge: 3600000,
          secure: true,
        }) // 1 hour
        .status(200)
        .redirect("/home");
    } catch (error) {
      console.log(error);
      // req.session.failLogin = true;
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

  .post(
    "/:uid/documents",
    verifyToken,
    upload.array("docs", 3),
    async (req, res) => {
      try {
        const user = await sessionService.getUserById(req.params.uid);
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
        const updatedUser = await sessionService.updateUser(user._id, user);
        res.status(200).send({
          status: "success",
          user: updatedUser,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error uploading documents" });
      }
    }
  )

  // endpoint for password reset and send email with token
  .post("/forgotPassword", async (req, res) => {
    try {
      const token = await sessionService.forgotPassword(req.body.email);
      const userMail = await sessionService.getUserByToken(token);

      if (!userMail) {
        return res.status(404).send({
          status: "error",
          message: "User not found",
        });
      }

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
                <a href="http://localhost:8080/api/sessions/resetPassword/${token}">Reset password</a>
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
    } catch (error) {
      console.error(error.message);
      res.send({
        status: "error",
        message: "Error sending email",
      });
    }
  })
  // reset password endpoint
  .get("/resetPassword/:token", async (req, res) => {
    try {
      const token = req.params.token;
      const user = await sessionService.getUserByToken(token);
      if (!user) {
        return res.status(404).send({
          status: "error",
          message: "User or token not invalid",
        });
      }
      res.render("resetPassword", {
        title: "Reset Password",
        token: token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: "error",
        message: "Error resetting password",
      });
    }
  })
  // reset password endpoint
  .post("/resetPassword", async (req, res) => {
    try {
      const { token, password } = req.body;
      const user = await sessionService.getUserByToken(token);
      if (!user) {
        return res
          .status(400)
          .send({ status: "error", message: "Invalid or expired token" });
      }
      user.password = password;
      const userNew = await sessionService.resetPassword(user);
      console.log("Password has been reset for user:", userNew);
      res.send({
        status: "success",
        message: "Password has been reset successfully",
      });
    } catch (error) {
      console.error("Error resetting password:", error.message);
      res
        .status(500)
        .send({ status: "error", message: "Error resetting password" });
    }
  })
  // actualizo el active del usuario a false si es que no se loguea en 30 dias
  .put("/inactive", async (req, res) => {
    try {
      const users = await sessionService.inactiveUsers();
      res.send({
        status: "success",
        message: "Users updated",
        users: users,
      });
    } catch (error) {
      console.error("Error updating users:", error.message);
      res
        .status(500)
        .send({ status: "error", message: "Error updating users" });
    }
  });
export default router;
