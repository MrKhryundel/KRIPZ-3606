const request = require('supertest');
const express = require('express');
const session = require('express-session');

jest.mock('../../models/Product', () => ({
    findById: jest.fn().mockResolvedValue({
        _id: '123',
        name: 'Test Product',
        price: 100
    })
}));

const app = express();
app.use(express.json());
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    req.flash = jest.fn();
    next();
});

const cartRouter = require('../../routes/cart');
app.use('/cart', cartRouter);

describe('Cart Routes Test', () => {
        const response = await request(app)
            .post('/cart/add/123')
            .send({
                productId: '123',
                quantity: 1
            })
            .expect(200);
            
        expect(response.body).toBeDefined();
    });

    it('should view cart', async () => {
        const response = await request(app)
            .get('/cart')
            .expect(200);
            
        expect(response.body).toBeDefined();
    });
});
