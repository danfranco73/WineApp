import bcrypt from "bcrypt";
// create hash password from user password   
const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// compare password with hash password
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export { createHash, isValidPassword };