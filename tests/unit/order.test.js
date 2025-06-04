const Order = require('../../models/Order');

describe('Order Model Test', () => {
    it('should create valid order', () => {
        const validOrder = new Order({
            products: [{
                product: {
                    name: 'Яблуко',
                    price: 20,
                    image: 'apple.jpg'
                },
                quantity: 2
            }],
            totalAmount: 40,
            customerName: 'Іван',
            customerEmail: 'ivan@test.com',
            customerPhone: '1234567890',
            deliveryMethod: 'Самовивіз',
            paymentMethod: 'Готівка',
            status: 'прийнято'
        });

        expect(validOrder.totalAmount).toBe(40);
        expect(validOrder.status).toBe('прийнято');
        expect(validOrder.products).toHaveLength(1);
    });

    it('should set default status', () => {
        const order = new Order({
            products: [],
            totalAmount: 0,
            customerName: 'Тест',
            customerEmail: 'test@test.com',
            customerPhone: '1234567890',
            deliveryMethod: 'Самовивіз',
            paymentMethod: 'Готівка'
        });

        expect(order.status).toBe('прийнято');
    });
});
