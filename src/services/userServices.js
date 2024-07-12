import userModel from "../dao/models/userModel.js";
import generateTokenJwt from "./utils/generateTokenJwt.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "./utils/functionsUtils.js";

export default class UserService {
  constructor() {
    this.users = userModel;
  }

  async register(user) {
    try {
      const newUser = await this.users.create(user);
      // hash password
      newUser.password = createHash(user.password);
      return newUser;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error registering user");
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.users.findOne({ email }).lean();
      return user;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error getting user by email");
    }
  }
  async updateUser(id, user) {
    try {
      const updatedUser = await this.users.findByIdAndUpdate(id, user, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error updating user");
    }
  }
  // login user from email and password and return token using jwt and user
  async login(email, password) {
    try {
      const logUser = await this.getUserByEmail(email);
      if (!logUser) {
        throw new Error("User not found");
      }
      if (!isValidPassword(logUser, password)) {
        throw new Error("Password incorrect");
      }
      console.log(logUser);
      delete logUser.password;
      logUser.token = generateTokenJwt(logUser);
      return logUser;
    } catch (error) {
      console.error(error.message);
      throw new Error("User invalid credentials 0");
    }
  }

  // forgot password and send email with token to reset password
  async forgotPassword(email) {
    const user = await userModel.findOne({ email }).lean();
    if (!user) {
      throw new Error("User not found");
    }
    // generate token to reset password
    const token = generateTokenJwt(user);
    user.resetPasswordToken = token;
    await userModel.findByIdAndUpdate(user._id, user);
    return token;
  }
  // get user by token
  async getUserByToken(token) {
    try {
      const decoded = jwt.verify(token, config.SECRET_ID);
      const user = await this.users.findById(decoded._id).lean();
      console.log(user,"gubt");
      return user;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error getting user by token");
    }
  }
  // reset password
  async resetPassword(user) {
    try {
      const userFound = await this.users.findById(user._id);
      userFound.password = createHash(user.password);
      userFound.resetPasswordToken = "";
      await userFound.save();
      return userFound;
    }
    catch (error) {
      console.error(error.message);
      throw new Error("Error reseting password");
    }
  }
  // get user by id
  async getUserById(uid) {
    try {
      const user = await this.users.findById(uid).lean();
      return user;
    } catch (error) {
      console.error(error.message);
    }
  }

  async deleteUser(id) {
    try {
      const user = await this.users.findByIdAndDelete(id);
      return user;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting user");
    }
  }
}
