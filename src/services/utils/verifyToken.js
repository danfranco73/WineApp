import jwt from "jsonwebtoken";
import config from "../../config/config.js";


const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.SECRET_ID); 
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export default verifyToken;
