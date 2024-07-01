// MongoDB connection
import config from "./config.js";

const userName = encodeURIComponent(config.MONGODB_USER);
const password = encodeURIComponent(config.MONGODB_PASS);

const uri  = `mongodb+srv://${userName}:${password}@ecommerce.0mbxros.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=eCommerce`;

export default uri;
