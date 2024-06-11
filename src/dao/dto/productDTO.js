// product DTO

export default class ProductDTO {
    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.description = product.description;
        this.category = product.category;
        this.code = product.code;
        this.quantity = product.quantity;
    }
}

