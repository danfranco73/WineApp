import { Router } from 'express';
import passport from 'passport';
import userModel from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils/functionsUtils.js';

const router = Router();

router
    .post("/register", async (req, res) => {
        try {
            req.session.failRegister = false;
            if (!req.body.email || !req.body.password) throw new Error("Register error!");
            const newUser = {
                first_name: req.body.first_name ?? "",
                last_name: req.body.last_name ?? "",
                email: req.body.email,
                age: req.body.age ?? "",
                password: createHash(req.body.password)
            }
            await userModel.create(newUser);
            res.redirect("/login");
        } catch (e) {
            console.log(e.message);
            req.session.failRegister = true;
            res.redirect("/register");
        }
    })

    .post("/login", async (req, res) => {
        try {
            const { email } = req.body;
            req.session.failLogin = false; // reset failLogin
            const result = await userModel.findOne({ email }).lean();
            if (!result) {
                req.session.failLogin = true;
                return res.redirect("/login");
            }

            console.log("Verificando ...", result.password, req.body.password);
            if (!isValidPassword(result, req.body.password)) {
                req.session.failLogin = true;
                return res.redirect("/login");
            }

            delete result.password;
            req.session.user = result;

            return res.redirect("/");
        } catch (e) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }
    })

    .get("/logout", (req, res) => {
        req.session.destroy();
        res.redirect("/login");
    })

    // restore password 
    .post("/restore", async (req, res) => {
        try {
            req.session.failRestore = false;
            const user = await userModel.findOne({ email: req.body.email }).lean();
            if (!user) {
                req.session.failRestore = true;
                return res.redirect("/restore");
            }
            // enter new password and hash it
            user.password = createHash(req.body.password);
            await userModel.updateOne({ email: user.email }, { password: user.password });
            res.redirect("/login");
        } catch (e) {
            req.session.failRestore = true;
            res.redirect("/restore");
        }
    })

    .get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
        res.send({
            status: 'success',
            message: 'Success'
        });
    })

    .get("/githubcallback", passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    })

    .get("/current", (req, res) => {
        const user = req.session.user;
        if (!user) return res.sendStatus(401);
        
        // create a DTO to send only the necessary data
        const userDTO = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        }
        res.send(userDTO);
    })

export default router;