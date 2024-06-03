// if the user is not logged in, it will be redirected to the login page
const auth = function (req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    return next();
}

// If the user is logged in, it will be redirected to the home page
const logged = function (req, res, next) {
    if (req.session.user) {
        return res.redirect("/");
    }
    next();
}

// Only the admin can access the admin panel
const admin = function (req, res, next) {
    if (req.session.user.role !== "admin") {
        return res.redirect("/");
    }
    next();
}

// Only the user can send messages to the chat and add products to the cart.
const userAuth = function (req, res, next) {
    if (req.session.user.role !== "user") {
        return res.redirect("/");
    }
    next();
}

export { auth, logged, admin, userAuth };