import express from 'express';
import faker from 'faker';
import productModel from '../../dao/models/productModel.js';

const mockProducts = express.Router();

const Product = productModel;

mockProducts
    .get('/mockingproducts', async (req, res) => {
        try {
            for (let i = 0; i < 100; i++) {
                const product = new Product({
                    title: faker.commerce.productName(),
                    name: faker.commerce.productName(),
                    price: faker.commerce.price(),
                    stock: faker.random.number(),
                    code: faker.random.alphaNumeric(),
                    image: faker.image.imageUrl(),
                    description: faker.commerce.productDescription()
                });
                await product.save();
            }
            console.log('Products added');
            const products = await Product.find();
            res.send(products);
        } catch (error) {
            res.send(error);
        }
    });

export default mockProducts;