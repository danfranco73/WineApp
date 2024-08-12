import { Router } from "express";
import upload from "../services/utils/utilMulter.js";
import productController from "../controllers/productController.js";
import verifyToken from "../services/utils/verifyToken.js";
import { handleRole, checkOwnership } from "../services/middlewares/roles.js";

const productManager = new productController();
const router = Router();

// Get all products with pagination, sorting, and searching
router
  .get("/", async (req, res, next) => {
    const products = await productManager.getProducts(req.query);
    res.send({ status: "success", payload: products });
  })
  

  // Get a product by ID
  .get("/:pid", /* verifyToken, */ async (req, res, next) => {
    const { pid } = req.params;
    try {
      const product = await productManager.getProductById(pid);
      if (product) {
        res.send({ status: "success", payload: product });
      } else {
        res
          .status(404)
          .send({ status: "error", message: "Producto no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  })

  // Add a new product with image upload (admin and Premium only)
  .post(
    "/",
    // verifyToken,
    handleRole(["admin", "premium"]),
    upload.single("image"),
    async (req, res, next) => {
      const userId = req.user._id;
      const userRole = req.user.role;
      const { title, description, code, price, stock, category } = req.body;
      try {
        const newProduct = {
          title,
          description,
          code,
          price,
          stock,
          category,
          // add req.user._id as owner if user is premium, otherwise add "admin"
          owner: userRole === "premium" ? userId : "admin",
          ...(req.file && { image: req.file.filename }), // Add image filename if uploaded
        };
        const product = await productManager.addProduct(newProduct);
        console.log(product); // Debug 
        res.send({ status: "success", payload: product });
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  )
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
        res.send({ status: "success", payload: updatedProduct });
      } else {
        res
          .status(404)
          .send({ status: "error", message: "Producto no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  })

  // Delete a product by pid, if the product owner is the same as the user (premiun) or the user is admin (can delete any product). But if the user is admin, and the product owner is premium, the owner should be notified with a email
  .delete(
    "/:pid",
    /* verifyToken, */
    handleRole(["admin", "premium"]),
    async (req, res, next) => {
      const { pid } = req.params; 
      const email = req.user.email;
      let isOwner = true;
      if (req.user.role === "premium") {
        isOwner = await checkOwnership(pid, email);
      }
      if (!isOwner) {
        return res.status(403).send({
          status: "error",
          message: "No tienes permiso para eliminar este producto",
        });
      }
      try {         
        const product = await productManager.getProductById(pid); // Get product details
        await productManager.deleteProduct(pid);
        if (req.user.role === 'admin' && product.owner.role === 'premium') {
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
        res.send({ status: 'success', message: 'Producto eliminado' });

      } catch (error) {
        next(error);
      }
    }
  );

export default router;
