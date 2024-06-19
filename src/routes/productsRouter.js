import { Router } from "express";
import upload from "../services/utils/utilMulter.js";
import { admin } from "../services/middlewares/auth.js";
import productController from "../controllers/productController.js";

const productManager = new productController();
const router = Router();


// Get all products with pagination, sorting, and searching
router
  .get("/", async (req, res) => {
    const { limit = 10, page = 1, sort = null, query = {} } = req.query;
    try {
      const products = await productManager.getProducts({ page, limit, sort, query });
      res.send({ status: "success", payload: products });
    } catch (error) {
      next(error);
    }
  })

  // Get a product by ID
  .get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
      const product = await productManager.getProductById(pid);
      if (product) {
        res.send({ status: "success", payload: product });
      } else {
        res.status(404).send({ status: "error", message: "Producto no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  })

  // Add a new product with image upload (admin only)
  .post("/", upload.single("image"), admin, async (req, res) => {
    const { title, description, code, price, stock, category } = req.body;
    try {
      const newProduct = {
        title,
        description,
        code,
        price,
        stock,
        category,
        ...(req.file && { image: req.file.filename }), // Add image filename if uploaded
      };
      const product = await productManager.addProduct(newProduct);
      res.send({ status: "success", payload: product });
    } catch (error) {
      next(error);
    }
  })

  // Update a product by ID
  .put("/:pid", admin, async (req, res) => {
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
        res.status(404).send({ status: "error", message: "Producto no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  })

  // Delete a product by ID
  .delete("/:pid", admin, async (req, res) => {
    const { pid } = req.params;
    try {
      await productManager.deleteProduct(pid);
      res.send({ status: "success", message: "Producto eliminado" });
    } catch (error) {
      next(error);
    }
  });

export default router;
