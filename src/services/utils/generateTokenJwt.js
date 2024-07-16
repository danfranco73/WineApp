import jwt from "jsonwebtoken";
import config from "../../config/config.js";


const generateTokenJwt = (user) => {
  const token = jwt.sign({_id:user._id,email:user.email}, config.SECRET_ID, { expiresIn: "360000" }); // 10 hours
  return token;
};
export default generateTokenJwt;
