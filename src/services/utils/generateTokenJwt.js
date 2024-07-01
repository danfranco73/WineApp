import jwt from "jsonwebtoken";
import config from "../../config/config.js";


const generateTokenJwt = (user) => {
  const token = jwt.sign(user, config.SECRET_ID, { expiresIn: "1h" });
  return token;
};
export default generateTokenJwt;
