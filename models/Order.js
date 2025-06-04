const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        product: {
            name: String,
            price: Number,
            image: String
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['прийнято', 'оплачено', 'в обробці', 'відправлено', 'доставлено'],
        default: 'прийнято'
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['прийнято', 'оплачено', 'в обробці', 'відправлено', 'доставлено']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String
    }],
    lastStatusUpdate: {
        type: Date,
        default: Date.now
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    deliveryMethod: {
        type: String,
        enum: ['Кур\'єрська доставка', 'Самовивіз', 'Нова Пошта', 'Укрпошта'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Оплата онлайн', 'Оплата при отриманні', 'Оплата карткою кур\'єру'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    deliveryDetails: {
        type: String,
        required: function() {
            return this.deliveryMethod !== 'Самовивіз';
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.pre('save', function(next) {
    if (this.isNew) {
        this.statusHistory = [{
            status: this.status || 'прийнято',
            timestamp: new Date(),
            note: 'Замовлення створено'
        }];
        this.lastStatusUpdate = new Date();
    }
    else if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
            note: 'Статус оновлено'
        });
        this.lastStatusUpdate = new Date();
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
