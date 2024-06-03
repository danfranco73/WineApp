// Realizar un middleware que pueda trabajar en conjunto con la estrategia “current” para hacer un sistema de autorización y delimitar el acceso a dichos endpoints:
// Sólo el administrador puede crear, actualizar y eliminar productos.
// Sólo el usuario puede enviar mensajes al chat.
// Sólo el usuario puede agregar productos a su carrito.

// Path: src/services/middlewares/acceso.js

import { Router } from "express";
import { auth, logged } from "../services/middlewares/auth.js";
import ProductsManagerDB from "../../dao/managers/ProductsManagerDB.js";
import ChatManagerDB from "../../dao/managers/ChatManagerDB.js";
import CartManagerDB from "../../dao/managers/CartManagerDB.js";

const products = new ProductsManagerDB();

const router = Router();

const renderWithLayout = (res, view, locals) =>
    res.render(view, { layout: "main", style: "style.css", ...locals });

const renderError = (res, redirect = "/login") => {
    console.error(e.message);
    res
        .redirect
        (redirect
        );
}

router
    // Index with auth middleware
    .get("/", auth, async (req, res) => {
        try {
            const productsData = await products.getProducts();
            renderWithLayout(res, "index", {
                title: "Ecommerce Users",
                products: productsData.docs,
                user: req.session.user,
                isValid: productsData.page > 0 && productsData.page <= productsData.totalPages,
            });
        } catch (e) {
            renderError(res);
        }
    })
    // Login with logged middleware (presumably checks if logged in)
    .get("/login", logged, (req, res) => {
        renderWithLayout(res, "login", {
            title: "Ecommerce Login",
            failLogin: req.session.failLogin ?? false,
            resgisterSuccess: req.session.resgisterSuccess ?? false,
        });
    })
    // Register with no middleware
    .get("/register", (req, res) => {
        renderWithLayout(res, "register", {
            title: "Ecommerce Register",
            failRegister: req.session.failRegister ?? false,
        });
    })
    // Restore password (unchanged)
    .post("/restore", (req, res) => {
        renderWithLayout(res, "restore", {
            title: "Ecommerce Restore Password",
            failRestore: req.session.failRestore ?? false,
        });
    })
    // Home page with query params for pagination, sorting, etc.
    .get("/home", async (req, res) => {
        const { page, limit, sort, query } = req.query;
        try {
            const productsData = await products.getProducts(page, limit, sort, query);
            renderWithLayout(res, "home", {
                title: "Ecommerce Home",
                products: productsData.docs,
                user: req.session.user,
                isValid: productsData.page > 0 && productsData.page <= productsData.totalPages,
            });
        } catch (e) {
            renderError(res);
        }
    })
    // Create product with auth middleware
    .post("/product", auth, async (req, res) => {
        try {
            const product = await products.createProduct(req.body);
            if (!product) {
                return res
                    .status(400)
                    .send({
                        status: "error",
                        message: "Product not created"
                    });
            }
            console.log("Product created correctly", product);
            res
                .status(201)
                .redirect("/")
        } catch (error) {
            res
                .status(400)
                .send({
                    status: "error",
                    message: "Error creating product"
                })
        }
    }
    )
    // Update product with auth middleware
    .put("/product/:id", auth, async (req, res) => {
        try {
            const product = await products.updateProduct(req.params.id, req.body);
            if (!product) {
                return res
                    .status(400)
                    .send({
                        status: "error",
                        message: "Product not updated"
                    });
            }
            console.log("Product updated correctly", product);
            res
                .status(200)
                .redirect("/")
        } catch (error) {
            res
                .status(400)
                .send({
                    status: "error",
                    message: "Error updating product"
                })
        }
    }
    )
    // Delete product with auth middleware
    .delete("/product/:id", auth, async (req, res) => {
        try {
            const product = await products.deleteProduct(req.params.id);
            if (!product) {
                return res
                    .status(400)
                    .send({
                        status: "error",
                        message: "Product not deleted"
                    });
            }
            console.log("Product deleted correctly", product);
            res
                .status(200)
                .redirect("/")
        } catch (error) {
            res
                .status(400)
                .send({
                    status: "error",
                    message: "Error deleting product"
                })
        }
    }
    )
    // Real Time Products with similar logic to index
    .get("/realTimeProducts", async (req, res) => {
        try {
            const productsData = await products.getProducts();
            renderWithLayout(res, "realTimeProducts", {
                title: "Real Time Products",
                products: productsData.docs,
                user: req.session.user,
                isValid: productsData.page > 0 && productsData.page <= productsData.totalPages,
            });
        } catch (e) {
            renderError(res);
        }
    })
    // Chat with auth middleware
    .post("/chat", auth, async (req, res) => {
        const chat = new ChatManagerDB();
        try {
            const message = await chat.sendMessage(req.body);
            if (!message) {
                return res
                    .status(400)
                    .send({
                        status: "error",
                        message: "Message not sent"
                    });
            }
            console.log("Message sent correctly", message);
            res
                .status(201)
                .redirect("/")
        } catch (error) {
            res
                .status(400)
                .send({
                    status: "error",
                    message: "Error sending message"
                })
        }
    }
    )
    // Cart with auth middleware
    .post("/cart", auth, async (req, res) => {
        const cart = new CartManagerDB();
        try {
            const product = await cart.addProduct(req.body);
            if (!product) {
                return res
                    .status(400)
                    .send({
                        status: "error",
                        message: "Product not added to cart"
                    });
            }
            console.log("Product added to cart correctly", product);
            res
                .status(201)
                .redirect("/")
        } catch (error) {
            res
                .status(400)
                .send({
                    status: "error",
                    message: "Error adding product to cart"
                })
        }
    }
    )

export default router;




