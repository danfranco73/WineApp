import UserService from '../../services/userServices.js';

class UserManager {
    constructor() {
        this.userService = new UserService();
    }

    async register(user) {
        return await this.userService.register(user);
    }

    async getUserByEmail(email) {
        return await this.userService.getUserByEmail(email);
    }

    async updateUser(id, user) {
        return await this.userService.updateUser(id, user);
    }

    async login(email, password) {
        return await this.userService.login(email, password);
    }

    async getUserById(id) {
        return await this.userService.getUserById(id);
    }

    async deleteUser(id) {
        return await this.userService.deleteUser(id);
    }
}

export default UserManager;