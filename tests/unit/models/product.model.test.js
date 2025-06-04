const mongoose = require('mongoose');
const Product = require('../../../models/Product');

describe('Product Model Test', () => {
    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('should create & save product successfully', async () => {
        const validProduct = new Product({
            name: 'Яблуко',
            description: 'Свіже яблуко',
            price: 25.50,
            image: 'apple.jpg',
            category: 'Фрукти',
            weight: 1000,
            weightUnit: 'г',
            country: 'Україна'
        });
        const savedProduct = await validProduct.save();
        
        expect(savedProduct._id).toBeDefined();
        expect(savedProduct.name).toBe(validProduct.name);
        expect(savedProduct.price).toBe(validProduct.price);
        expect(savedProduct.inStock).toBe(true); // default value
    });

    it('should fail to save product without required fields', async () => {
        const productWithoutRequiredField = new Product({ name: 'Test Product' });
        let err;
        
        try {
            await productWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should fail to save product with invalid category', async () => {
        const productWithInvalidCategory = new Product({
            name: 'Test Product',
            description: 'Test Description',
            price: 100,
            image: 'test.jpg',
            category: 'InvalidCategory',
            weight: 500,
            weightUnit: 'г',
            country: 'Україна'
        });
        
        let err;
        try {
            await productWithInvalidCategory.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.category).toBeDefined();
    });
});
