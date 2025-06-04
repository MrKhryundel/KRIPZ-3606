const Product = require('../../models/Product');

describe('Product Model Test', () => {
    it('should create valid product', () => {
        const validProduct = new Product({
            name: 'Яблуко',
            description: 'Свіже яблуко',
            price: 20,
            category: 'Фрукти',
            image: 'apple.jpg',
            weight: 1000,
            weightUnit: 'г',
            country: 'Україна',
            ingredients: 'яблуко',
            inStock: true
        });

        expect(validProduct.name).toBe('Яблуко');
        expect(validProduct.price).toBe(20);
        expect(validProduct.category).toBe('Фрукти');
    });

    it('should require mandatory fields', () => {
        const productWithoutRequired = new Product({});
        const validationError = productWithoutRequired.validateSync();
        
        expect(validationError.errors.name).toBeDefined();
        expect(validationError.errors.price).toBeDefined();
        expect(validationError.errors.category).toBeDefined();
    });
});
