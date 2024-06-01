import {Router} from "express";
import twilio from "twilio";
import config from "../../config/config.js";



const smsRouter = Router();

// Constants from the environment for user mailing
const accountSid = config.ACCOUNT_SID;
const authToken = config.AUTH_TOKEN;


// Twilio test
smsRouter.get("/sms-send", async (req, res) => {  
    const client = twilio(accountSid, authToken);  
    client.messages.create({
      body: "Message from my app to my phone!",
      from: "+14155238886",
      to: "+543855870154",
    }).then(message => console.log(message.sid));
  
    res.send("SMS sent");
  
  });

export default smsRouter;