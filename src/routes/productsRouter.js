import { Router } from "express";
import upload from "../services/utils/utilMulter.js";
import ProductController from "../controllers/productController.js";
import verifyToken from "../services/utils/verifyToken.js";
import { handleRole, checkOwnership } from "../services/middlewares/roles.js";

const productManager = new ProductController();
const router = Router();

// Get all products with pagination, sorting, and searching
router
  .get("/", async (req, res, next) => {
    const products = await productManager.getProducts(req.query);
    return res.send({ status: "success", payload: products });
  })

  // Get a product by ID
  .get(
    "/:pid",
    /* verifyToken, */ async (req, res, next) => {
      const { pid } = req.params;
      try {
        const product = await productManager.getProductById(pid);
        if (product) {
          return res.send({ status: "success", payload: product });
        } else {
          return res
            .status(404)
            .send({ status: "error", message: "Producto no encontrado" });
        }
      } catch (error) {
        next(error);
      }
    }
  )

  // Add a new product with image upload (assuming upload.single is configured)
  .post("/", upload.single("image"), async (req, res, next) => {
    try {
      const user = req.session.user;
      const userRole = user.role;
      const owner = userRole === "premium" ? user.email : "admin@localhost";
      const thumbnails = req.file ? req.file.path : null;
      const { title, description, code, price, stock, category } = req.body;
      const product = {
        title,
        description,
        code,
        price,
        stock,
        category,
        owner,
        thumbnails,};
      const newProduct = await productManager.addProduct(product);
      console.log(newProduct);

      return res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) {
      console.log(error);
      next(error);
    }
  })

  .put("/:pid", verifyToken, handleRole(["admin"]), async (req, res, next) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category } = req.body;
    try {
      const updatedProduct = await productManager.updateProduct(pid, {
        title,
        description,
        code,
        price,
        stock,
        category,
      });
      if (updatedProduct) {
        return res.send({ status: "success", payload: updatedProduct });
      } else {
        return res
          .status(404)
          .send({ status: "error", message: "Producto no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  })

  // Delete a product by pid, if the product owner is the same as the user (premiun) or the user is admin (can delete any product). But if the user is admin, and the product owner is premium, the owner should be notified with a email
  .delete("/:pid", handleRole(["admin", "premium"]), async (req, res, next) => {
    const { pid } = req.params;
    // console.log(pid); ok
    const user = req.session.user;
    // console.log(user.role); ok
    const email = user.email;
    // console.log(email); ok
    const isOwner = await checkOwnership(pid, user); //
    console.log(isOwner);
    if (isOwner) {
      try {
        // proceed to delete the product
        const product = await productManager.getProductById(pid);
        console.log(product);
        
        if (!product) {
          throw new Error("Product not found");
        }
        await productManager.deleteProduct(pid);

        // Send notification email if the product owner is premium and the user is admin

        if (user.role === "admin" && product.owner.role === "premium") {
          await sendNotificationEmail(product.owner.email, product); // Send notification
          const sendNotificationEmail = async (ownerEmail, product) => {
            try {
              const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                service: "gmail",
                port: 587,
                secure: false,
                tls: {
                  rejectUnauthorized: false,
                },
                auth: {
                  user: config.USER_MAILING,
                  pass: config.USER_MAILING_PASS,
                },
              });

              const mailOptions = {
                from: `Admin <${config.USER_MAILING}>`,
                to: ownerEmail, // Use the owner's email directly
                subject: "Product Deleted",
                text: `Your product "${product.title}" has been deleted by the Admin.`, // Include product title for clarity
              };

              await transporter.sendMail(mailOptions);
              console.log("Email sent successfully.");
            } catch (error) {
              console.error("Error sending notification email:", error);
            }
          };
        }
        return res.send({ status: "success", message: "Producto eliminado" });
      } catch (error) {
        console.log(error);
        
        next(error);
      }
    } else {
      return res.status(401).send("Unauthorized");
    }
  });

export default router;
