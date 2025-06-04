const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { sendOrderConfirmation } = require('../utils/mailer');

router.get('/', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart/index', { cart });
});

router.post('/add/:id', async (req, res) => {
    try {
        const Product = require('../models/Product');
        const productId = req.params.id;
        const quantity = parseInt(req.body.quantity) || 1;

        const product = await Product.findById(productId);
        if (!product) {
            req.flash('error_msg', 'Товар не знайдено');
            return res.redirect('/products');
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const existingItem = req.session.cart.find(item => item.product._id.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            req.session.cart.push({
                product: product,
                quantity: quantity
            });
        }

        req.flash('success_msg', 'Товар додано до кошика');
        res.redirect('/products');
    } catch (error) {
        req.flash('error_msg', 'Error adding to cart');
        res.redirect('/products');
    }
});

router.post('/remove/:id', (req, res) => {
    try {
        const productId = req.params.id;
        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(item => item.product._id.toString() !== productId);
            req.flash('success_msg', 'Товар видалено з кошика');
        }
        res.redirect('/cart');
    } catch (error) {
        req.flash('error_msg', 'Помилка при видаленні товару');
        res.redirect('/cart');
    }
});

router.post('/checkout', async (req, res) => {
    try {
        if (!req.session.cart || req.session.cart.length === 0) {
            req.flash('error_msg', 'Кошик порожній');
            return res.redirect('/cart');
        }        
        if (req.body.paymentMethod === 'Оплата карткою кур\'єру' && req.body.deliveryMethod !== 'Кур\'єрська доставка') {
            req.flash('error_msg', 'Оплата карткою кур\'єру доступна тільки при кур\'єрській доставці');
            return res.redirect('/cart');
        }


        const order = new Order({
            products: req.session.cart.map(item => ({
                product: {
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image
                },
                quantity: item.quantity
            })),
            totalAmount: req.body.totalAmount,
            customerName: req.body.customerName,
            customerEmail: req.body.customerEmail,
            customerPhone: req.body.customerPhone,
            deliveryMethod: req.body.deliveryMethod,
            paymentMethod: req.body.paymentMethod,
            address: req.body.deliveryMethod === 'Самовивіз' ? 'Самовивіз' : req.body.address,
            deliveryDetails: req.body.deliveryMethod === 'Самовивіз' ? 'Самовивіз' : req.body.deliveryDetails
        });        await order.save();
        await sendOrderConfirmation(order);
        
        req.session.cart = [];
        req.flash('success_msg', 'Замовлення успішно оформлено');
        res.redirect('/');
    } catch (error) {
        req.flash('error_msg', 'Помилка при оформленні замовлення');
        res.redirect('/cart');
    }
});

module.exports = router;
