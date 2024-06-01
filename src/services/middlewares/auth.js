const auth = function (req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    return next();
}

const logged = function (req, res, next) {
    if (req.session.user) {
        return res.redirect("/");
    }
    next();
}

export { auth, logged };