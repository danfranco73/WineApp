import jwt from "jsonwebtoken";
import config from "../../config/config.js";

const verifyToken = (req, res, next) => {
  const headerToken = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : undefined;
  const cookieToken =
    req.cookies && req.cookies[`${config.APP_NAME}_cookie`]
      ? req.cookies[`${config.APP_NAME}_cookie`]
      : undefined;
  const queryToken = req.query.token ? req.query.token : undefined;
  const paramsToken = req.params.token ? req.params.token : undefined;
  const receivedToken = headerToken || cookieToken || queryToken || paramsToken;

  // logs de debug
  console.log("headerToken", headerToken);
  console.log("cookieToken", cookieToken);
  console.log("queryToken", queryToken);
  console.log("paramsToken", paramsToken);
  console.log("receivedToken", receivedToken);

  if (!receivedToken)
    return res
      .status(401)
      .send({ origin: config.SERVER, payload: "Se requiere token" });

  console.log("Received Token:", receivedToken); // Log the token

  jwt.verify(receivedToken, config.SECRET_ID, (err, payload) => {
    if (err) {
      console.error("token de verificacion", err);
      return res
        .status(401)
        .send({ origin: config.SERVER, payload: "Token has expired" });
    }
    console.log("Payload:", payload); // Log the payload
    req.user = payload;
    next();
  });
};

export default verifyToken;
