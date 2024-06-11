// user dto

export default class UserDTO {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
    }
}

