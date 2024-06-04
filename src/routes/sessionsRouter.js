import { Router } from 'express';
import passport from 'passport';
import UserManager from '../dao/managers/userManager.js';
import { admin } from '../services/middlewares/auth.js';


const router = Router();
const sessionService = new UserManager();

router
    // github login and return user
    .get("/github", passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
        res.send({
            status: 'success',
            message: 'Success'
        });
    })
    // github callback and return user
    .get("/githubcallback", passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    })
    // logout and destroy session and redirect to login and show message and delet cookie
    .get("/logout", (req, res) => {
        req.session.destroy();
        console.log("User logged out");
        res.clearCookie("jwt");
        res.redirect('/login');
    })

    // register user and return user
    .post("/register", async (req, res) => {
        try {
            req.session.failRegister = false;
            const user = await sessionService.register(req.body);
            console.log("User registered correctly", user);
            res
                .status(201)
                .redirect("/login")
        } catch (error) {
            res
                .status(400)
                .send({
                    status: "error",
                    message: "Error registering user"

                })
        }
    })
    // login and create session and redirect to home
    .post("/login", async (req, res) => {
        try {
            const user = await sessionService.login(req.body.email, req.body.password);
            if (!user) {
                req.session.failLogin = true;
                console.error("User invalid credentials ");
                return res.redirect("/login");
            }
            console.log("User logged in correctly en el sessionRouter", user);
            req.session.user = user; // save user in session
            if (user.role === "admin") {
                return res
                    .cookie("jwt", user.token, { httpOnly: true, maxAge: 3600000 }) // 1 hour
                    .status(200)
                    .redirect("/realTimeProducts")
            }
            return res
                .cookie("jwt", user.token, { httpOnly: true, maxAge: 3600000 }) // 1 hour
                .status(200)
                .redirect("/")
        } catch (error) {
            req.session.failLogin = true;
            console.error(error.message);
            res.redirect("/login");
        }
    })
    // "current" endpoint to get the current user only if it is logged in (admin is allowed to see all users)
    .get("/current", (req, res) => {
        const user = req.session.user;
        if (!user) return res.sendStatus(401);
        if (user.role === "admin") {
            return res
                .json({
                    status: "User is admin",
                    user: user,
                });
        } else {
            const userDTO = {
                email: user.email,
                uid: user._id,
                name: user.first_name,
                surname: user.last_name,
                role: user.role,
            };
            return res
                .json({
                    status: "User is not admin",
                    user: userDTO,
                });
        }
    })

    // get user by id
    .get("/:uid", async (req, res) => {
        const user = await sessionService.getUserById(req.params.uid);
        if (!user) return res.sendStatus(404);
        console.log("User found");
        res
            .send({
                status: "success",
                user: user
            });
    })

export default router;