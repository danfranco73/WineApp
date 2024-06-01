//  configuro multer para ser usado en mi proyecto
import multer from "multer";
import path from "path";
import __dirname from "./utils.js";
// antes de usar multer, tengo que configurar el storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public", "img"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

export default upload;