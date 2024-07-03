import userModel from "../dao/models/userModel.js";
import generateTokenJwt from "./utils/generateTokenJwt.js";
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
            throw new Error('Error registering user');
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await this.users.findOne({ email }).lean();
            return user;
        } catch (error) {
            console.error(error.message);
            throw new Error('Error getting user by email');
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
            throw new Error('Error updating user');
        }
    }
    // login user from email and password and return token using jwt and user
    async login(email, password) {
        try {
            const logUser = await this.getUserByEmail(email);
            if (!logUser) {
                throw new Error('User not found');
            }
            if (!isValidPassword(logUser, password)) {
                throw new Error('Password incorrect');
            }       
            console.log(logUser);
            delete logUser.password;
            logUser.token = generateTokenJwt(logUser);
            return logUser;
        }
        catch (error) {
            console.error(error.message);
            throw new Error('User invalid credentials 0');
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
            throw new Error('Error deleting user');
        }
    }

    async forgotPassword(email) {
        const user = await userModel.findOne({ email }).lean();
        if (!user) {
            throw new Error("User not found");
        }
        const token = generateTokenJwt({ email, id: user._id }); // Generate JWT token
        user.resetPasswordToken = token; // Store token in user document
        user.resetPasswordExpires = Date.now() + 3600000; // Set expiration (1 hour)
        await userModel.updateOne({ email }, user);
        return user;
    }

    async resetPassword(token, password) {
        const user = await userModel.findOne({
            resetPasswordToken: token,// Find user by token
            resetPasswordExpires: { $gt: Date.now() },// Check if token is expired0
        }).lean();
        if (!user) {
            throw new Error("Invalid or expired token");
        }
        if (password === user.password) {
            throw new Error("New password cannot be the same as the old password");
        }
        user.password = createHash(password);// Hash new password
        user.resetPasswordToken = undefined;// Clear token and expiration
        user.resetPasswordExpires = undefined;// Update user document
        return await userModel.updateOne({ email: user.email }, user);// Return user
    }
}