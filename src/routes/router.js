import { Router } from "express";
import jwt from "jsonwebtoken";

export default class RouterBase {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }
    init() {
        this.router.get("/", (req, res) => {
            res.status(200).json({ message: "Hello World" });
        });
    }

    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, this.this.applyCallbacks(callbacks));
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.appy(this.params);
            }
            catch (error) {
                console.log(error);
                params[1].status(500).send(error);
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = Payload => res.send({ status: "success", Payload })
        res.senServerError = error => res.status(500).send({ status: "error", error })
        res.sendNotFound = message => res.status(404).send({ status: "not found", message })
        res.sendUserError = error => res.status(400).send({ status: "error", error })
    }

    handlePolicies(policies) {
        return (req, res, next) => {
            if (policies[0] === "PUBLIC") return next();
            const { authorization } = req.headers;
            if (!authorization) return res.status(401).send({ status: "error", error: "Unauthorized" })

            const token = authorization.split(" ")[1];

            try {
                const user = jwt.verify(token, process.env.JWT_SECRET);
                if (!policies.includes(user.role.toUpperCase())) return res.status(403).send({ status: "error", error: "Forbidden" })
                req.user = user;
                next();
            } catch (error) {
                res.status(500).send({ status: "error", error: error.message })
            }
        }
    }
} 

