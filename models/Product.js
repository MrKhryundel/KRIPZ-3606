const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Овочі', 'Фрукти', "М'ясо", 'Риба', 'Молочні продукти', 'Напої', 'Бакалія', 'Солодощі']
    },
    brand: {
        type: String,
        default: 'Не вказано'
    },
    weight: {
        type: Number,
        required: true
    },
    weightUnit: {
        type: String,
        enum: ['г', 'кг', 'мл', 'л', 'шт'],
        default: 'г'
    },
    country: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        default: 'Не вказано'
    },
    inStock: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
