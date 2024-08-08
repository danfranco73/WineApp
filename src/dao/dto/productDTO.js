// product DTO

export default class ProductDTO {
    constructor(product) {
        this.title = product.title;
        this.price = product.price;
        this.description = product.description;
        this.category = product.category;
        this.stock = product.stock;
        this.thumbnails = product.thumbnails;
        this.owner = product.owner;
    }
}

