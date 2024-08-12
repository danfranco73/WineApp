// user dto class to transform data from the database into a user object all in UPPERCASE


export class UserDTO {
    constructor(user) {
        this.ID = user._id;
        this.FIRST_NAME = user.first_name;
        this.EMAIL = user.email;
        this.ROLE = user.role;
        this.CART = user.cart;
        this.LAST_CONNECTION = user.last_connection;
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

