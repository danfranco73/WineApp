// if the user is not logged in, it will be redirected to the login page
const auth = function (req, res, next) {
  if (!req.session.user) {
    return res.status(401).redirect("/login");
  }
  return next();
};

// check if the user is logged and if it is, continue, otherwise alert yo need to log in
const logged = function (req, res, next) {
  if (!req.session.user) {
    return res.status(401).send("You need to log in to perform this action.");
  }
  return next();
}
// VERIFICO QUE EL UID ES EL MISMO QUE ESTA LOGGEDO
const checkUser = function (req, res, next) {
  if (req.session.user._id !== req.params.uid) {
    return res
      .status(403)
      .send("You don't have permission to perform this action.");
  }
  next();
};

// Only the admin can access the admin panel
const admin = function (req, res, next) {
  if (req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
};
// if the user is admin cannot acces to the user panel
const isNotAdmin = function (req, res, next) {
  // check if user is logged
  if (!req.session || !req.session.user) {
    return res
      .status(401)
      .send("You must be logged in to perform this action.");
  }
  // check if user is admin
  if (req.session.user.role === "admin") {
    return res
      .status(403)
      .send("You don't have permission to perform this action.");
  }
  next();
};

const userAuth = function (req, res, next) {
  console.log(req.session.user.role);
  if (req.session.user.role !== "user") {
    return res
      .status(403)
      .send("You don't have permission to perform this action.");
  }
  if (!req.session.user) {
    return res
      .status(401)
      .send("You must be logged in to perform this action.");
  }
  next();
};

export { auth, logged, admin, userAuth, isNotAdmin, checkUser };
