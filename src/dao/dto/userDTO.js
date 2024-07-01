// user dto class to transform data from the database into a user object all in UPPERCASE

export class UserDTO {
    constructor(user) {
        this.ID = user._id;
        this.NAME = user.name;
        this.EMAIL = user.email;
        this.PASSWORD = user.password;
        this.CREATED_AT = user.createdAt;
        this.UPDATED_AT = user.updatedAt;
    }
}

// post dto class to transform data from the database into a post object all in UPPERCASE

export class PostDTO {
    constructor(post) {
        this.ID = post._id;
        this.TITLE = post.title;
        this.CONTENT = post.content;
        this.CREATED_AT = post.createdAt;
        this.UPDATED_AT = post.updatedAt;
    }
}

