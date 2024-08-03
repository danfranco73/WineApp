import bcrypt from "bcrypt";
// create hash password from user password
const createHash =  (password) => {
    return bcrypt.hashSync(password, 10);
    };

// compare password from user and hash password

const isValidPassword = async (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export { createHash, isValidPassword };
