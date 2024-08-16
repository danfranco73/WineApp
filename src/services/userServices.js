import userModel from "../dao/models/userModel.js";
import generateTokenJwt from "./utils/generateTokenJwt.js";
import { UserDTO } from "../dao/dto/userDTO.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "./utils/functionsUtils.js";

export default class UserService {
  constructor() {
    this.users = userModel;
  }

  async register(user) {
    try {
      user.password = createHash(user.password); 
      const newUser = await this.users.create(user);
      return newUser;
    } catch (error) {
      console.log(error);
      console.error(error.message);
      throw new Error("Error registering user");
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.users.findOne({ email }).lean(); // lean to return plain js object
      return user;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error getting user by email");
    }
  }
  async updateUser(id, user) {
    try {
      if (user.password) {
        user.password = createHash(user.password); // hash password before saving
      }
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
      const token = generateTokenJwt(logUser);
      logUser.token = token;
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
    await userModel.findByIdAndUpdate(user._id, { resetPasswordToken: token });
    return token;
  }
  // get user by token
  async getUserByToken(token) {
    try {
      const decoded = jwt.verify(token, config.SECRET_ID);
      const user = await this.users.findById(decoded._id).lean();
      console.log(user, "gubt");
      return user;
    } catch (error) {
      console.error("Error getting user by token:", error.message);
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
    } catch (error) {
      console.error("Error reseting password:", error.message);
      throw new Error("Error reseting password");
    }
  }
  // get all users show only the userDTO
  async getAllUsers() {
    try {
      const users = await this.users.find().lean();
      return users.map((user) => new UserDTO(user));
    } catch (error) {
      console.error("Error getting all users:", error.message);
      throw new Error("Error getting all users");
    }
  }
  // get user by id
  async getUserById(uid) {
    try {
      const user = await this.users.findById(uid).lean();
      return user;
    } catch (error) {
      console.error("Error getting user by id:", error.message);
      throw new Error("Error getting user by id");
    }
  }

  async deleteUser(uid) {
    try {
      const user = await this.users.findByIdAndDelete(uid);
      return user;
    } catch (error) {
      console.error("Error deleting user:", error.message);
      throw new Error("Error deleting user");
    }
  }

  async getInactiveUsers() {
    try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const users = await this.users.find({
        last_connection: { $lt: twoDaysAgo },
      });
      return users;
    } catch (error) {
      console.error("Error getting inactive users:", error.message);
      throw new Error("Error getting inactive users");
    }
  }
  // delete users with no connection in the last 2 days
  async deleteInactiveUsers() {
    try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const result = await this.users.deleteMany({
        last_connection: { $lt: twoDaysAgo },
      });

      // Get the deleted user IDs from the result object
      const deletedUserIds = result.deletedCount > 0 ? result.deletedCount : [];
      console.log(deletedUserIds);

      // Return the deleted user IDs
      return deletedUserIds;
    } catch (error) {
      console.error("Error deleting inactive users:", error.message);
      throw new Error("Error deleting inactive users");
    }
  }

  // count users
  async countUsers() {
    try {
      const users = await this.users.countDocuments();
      return users;
    } catch (error) {
      console.error("Error counting users:", error.message);
      throw new Error("Error counting users");
    }
  }
}
