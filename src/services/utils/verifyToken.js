import jwt from "jsonwebtoken";
import config from "../../config/config.js";


const verifyToken = (req, res, next) => {
  const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1]: undefined;
  const cookieToken = req.cookies && req.cookies[`${config.APP_NAME}_cookie`] ? req.cookies[`${config.APP_NAME}_cookie`]: undefined;
  const queryToken = req.query.token ? req.query.token: undefined;
  const paramsToken = req.params.token ? req.params.token: undefined;
  const receivedToken = headerToken || cookieToken || queryToken || paramsToken;
  

  if (!receivedToken) return res.status(401).send({ origin: config.SERVER, payload: 'Se requiere token' });

  jwt.verify(receivedToken, config.SECRET_ID, (err, payload) => {
    console.log('payload en verifytk', payload);
      if (err) return res.status(403).send({ origin: config.SERVER, payload: 'Token no válido' });
      req.user = payload;
      next();
  });
}

export default verifyToken;
