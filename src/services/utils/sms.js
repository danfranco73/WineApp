import { Router } from "express";
import twilio from "twilio";
import config from "../../config/config.js";



const smsRouter = Router();

// Constants from the environment for user mailing
const accountSid = config.ACCOUNT_SID;
const authToken = config.AUTH_TOKEN;


// Twilio test with whatsapp
smsRouter.get("/sms-send", async (req, res) => {
  const client = twilio(accountSid, authToken);
  client.messages
    .create({
      body: "Message from my app trhu whatsapp to my phone!",
      from: "whatsapp:+14155238886",
      to: "whatsapp:+543855870154",
    })
    .then(message => console.log(message.sid))
    
  res.send("SMS sent");

});

// Twilio test with sms

smsRouter.get("/sms-send-sms", async (req, res) => {
  const client = twilio(accountSid, authToken);
  client.messages
    .create({
      body: "Message from my app trhu sms to my phone!",
      from: "+13392015371",
      to: "+543855870154",
    })
    .then(message => console.log(message.sid))
    
  res.send("SMS sent");

});



export default smsRouter;