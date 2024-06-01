import jwt from 'jsonwebtoken';
// import privateKey from '../config/privateKey.js';

const generateTokenJwt = (user) => {  
    const token = jwt.sign(
        { user },
        "41717b2b005f59abdfadca1347d346123ee67e3f",
        { expiresIn: '1h' }
    );
    return token;
}
export default generateTokenJwt;


