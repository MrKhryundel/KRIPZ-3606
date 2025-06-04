const request = require('supertest');
const express = require('express');
const productsRouter = require('../../routes/products');

const app = express();
app.use(express.json());
app.use('/products', productsRouter);

jest.mock('../models/Product', () => ({
    find: jest.fn().mockResolvedValue([
        {
            name: 'Test Product',
            price: 100,
            description: 'Test Description'
        }
    ]),
    findById: jest.fn().mockResolvedValue({
        name: 'Test Product',
        price: 100,
        description: 'Test Description'
    })
}));

describe('Products Routes Test', () => {
    it('should get products list', async () => {
        const response = await request(app)
            .get('/products')
            .expect(200);
            
        expect(response.body).toBeDefined();
    });

    it('should get single product', async () => {
        const response = await request(app)
            .get('/products/123')
            .expect(200);
            
        expect(response.body).toBeDefined();
    });
});
