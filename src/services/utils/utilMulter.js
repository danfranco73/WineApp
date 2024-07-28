import multer from "multer";
import path from "path";
import {__dirname} from "./utils.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, path.join(__dirname, "public", 'documents'));
  },
filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({ storage });

export default upload;

