import bcrypt from "bcrypt";
// create hash password from user password   
const createHash = (password) => bcrypt.hashSync(password, 10);

// compare password entered with hash password
const isValidPassword = (hash, password) => bcrypt.compareSync(password, hash);

export { createHash, isValidPassword };