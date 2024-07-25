import multer from "multer";
import path from "path";
import {__dirname} from "./utils.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";
    if (file.fieldname === "docs") {
      folder = "documents";
    } else if (file.fieldname === "profile") {
      folder = "profiles";
    } else if (file.fieldname === "product") {
      folder = "products";
    }
    cb(null, path.join(__dirname, "public", folder));
  }
});

const upload = multer({ storage });

export default upload;

