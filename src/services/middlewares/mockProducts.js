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
                    name: faker.commerce.productName(),
                    price: faker.commerce.price(),
                    image: faker.image.imageUrl(),
                    description: faker.commerce.productDescription()
                });
                await product.save();
            }
            // muestro en la consola que se han añadido los productos y los muestro en la respuesta de la petición
            console.log('Products added');
            const products = await Product.find();
            res.send(products);
        } catch (error) {
            res.send(error);
        }
    });

export default mockProducts;