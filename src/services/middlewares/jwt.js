// middleware to verify the token

// Path: src/middlewares/jwt.js

import jwt from 'jsonwebtoken';
import  SECRET_ID  from '../../config/passportConfig.js';

const authorization = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_ID);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

export default authorization;
