import { Router } from "express";
import nodemailer from "nodemailer";
import config from "../../config/config.js";
import path from "path";
import __dirname from "./utils.js";

// Constants from the environment for user mailing
const userMailing = config.USER_MAILING;
const userMailingPass = config.USER_MAILING_PASS;

const mailingRouter = Router();

// mail test
mailingRouter.get("/send-email", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      // Using .env file to hide the credentials
      user: userMailing,
      pass: userMailingPass,
    },
  });

  const mailOptions = {
    from: "Dan Franco <{process.env.USER_MAILING}>",
    to: "danielfrancotucu@hotmail.com",
    subject: "Sending Email using nodemailer",
    html: `
      <div>
      <h1>Hola</h1>
      <br>
      <p>Mailing listo desde mi codigo</p>
      </div>
      `,
    attachments: [
      {
        filename: "Pictest.jpg",
        path: path.join(__dirname, "public/img/Pictest.jpg"),
        cid: "Enduro 4ever!"
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error
      );
    } else {
      console.log("Email sent: " + info.response);
      res.send({
        status: "success",
        message: "Email sent"
      })
    }
  });
});



export default mailingRouter;

