import { Router } from "express";
import upload from "../services/utils/utilMulter.js";
import ProductsManagerDB from "../dao/managers/ProductsManagerDB.js";
import {admin} from "../services/middlewares/auth.js";


const productManager = new ProductsManagerDB();
const router = Router();

const handleError = (res, message) => {
  res.status(400).send({ status: "error", message });
};

// Get all products with pagination, sorting, and searching
router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  try {
    const products = await productManager.getProducts({ page, limit, sort, query });
    res.send({ status: "success", payload: products });
  } catch (error) {
    handleError(res, error.message);
  }
});

// Get a product by ID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(pid);
    if (product) {
      res.send({ status: "success", payload: product });
    } else {
      res.status(404).send({ status: "error", message: "Producto no encontrado" });
    }
  } catch (error) {
    handleError(res, error.message);
  }
});

// Add a new product with image upload (assuming upload.single is configured)
router.post("/", upload.single("image"), admin , async (req, res) => {
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
    handleError(res, error.message);
  }
});

// Update a product by ID
router.put("/:pid", admin, async (req, res) => {
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
    handleError(res, error.message);
  }
});

// Delete a product by ID
router.delete("/:pid",admin, async (req, res) => {
  const { pid } = req.params;
  try {
    await productManager.deleteProduct(pid);
    res.send({ status: "success", message: "Producto eliminado" });
  } catch (error) {
    handleError(res, error.message);
  }
});

export default router;
