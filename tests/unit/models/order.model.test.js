const mongoose = require('mongoose');
const Order = require('../../../models/Order');

describe('Order Model Test', () => {
    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('should create & save order successfully', async () => {
        const validOrder = new Order({
            products: [{
                product: {
                    name: 'Test Product',
                    price: 100,
                    image: 'test.jpg'
                },
                quantity: 2
            }],
            totalAmount: 200,
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            customerPhone: '+380991234567',
            deliveryMethod: 'Самовивіз',
            paymentMethod: 'Оплата онлайн',
            address: 'Test Address'
        });
        
        const savedOrder = await validOrder.save();
        
        expect(savedOrder._id).toBeDefined();
        expect(savedOrder.status).toBe('прийнято'); // default status
        expect(savedOrder.totalAmount).toBe(200);
        expect(savedOrder.products).toHaveLength(1);
    });

    it('should fail to save order without required fields', async () => {
        const orderWithoutRequiredField = new Order({
            customerName: 'John Doe'
        });
        let err;
        
        try {
            await orderWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });    it('should update status history when status changes', async () => {
        const order = new Order({
            products: [{
                product: {
                    name: 'Test Product',
                    price: 100,
                    image: 'test.jpg'
                },
                quantity: 1
            }],
            totalAmount: 100,
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            customerPhone: '+380991234567',
            deliveryMethod: 'Самовивіз',
            paymentMethod: 'Оплата онлайн',
            address: 'Test Address'
        });
        
        const savedOrder = await order.save();
        expect(savedOrder.statusHistory).toHaveLength(1); // Initial status
        expect(savedOrder.statusHistory[0].status).toBe('прийнято');

        savedOrder.status = 'оплачено';
        const updatedOrder = await savedOrder.save();
        
        expect(updatedOrder.statusHistory).toHaveLength(2); // Initial status + new status
        expect(updatedOrder.statusHistory[1].status).toBe('оплачено');
    });
});
