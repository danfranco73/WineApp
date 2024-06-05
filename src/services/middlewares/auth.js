// if the user is not logged in, it will be redirected to the login page
const auth = function (req, res, next) {
    if (!req.session.user) {
        return res
            .status(401)
            .redirect("/login");
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

const userAuth = function (req, res, next) {
    console.log(req.session.user.role);
    if (req.session.user.role !== "user") {
        return res.status(403).send("You don't have permission to perform this action.");
    }
    if (!req.session.user) {
        return res.status(401).send("You must be logged in to perform this action.");
    }
    next();
}

export { auth, logged, admin, userAuth };