const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { ensureAuthenticated } = require('../middleware/auth');
const { sendStatusUpdate } = require('../utils/mailer');

router.get('/login', (req, res) => {
    res.render('admin/login', {
        title: 'Admin Login'
    });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        
        if (!admin) {            req.flash('error_msg', 'Невірний логін або пароль');
            return res.redirect('/admin/login');
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            req.flash('error_msg', 'Невірний логін або пароль');
            return res.redirect('/admin/login');
        }

        req.session.isAdmin = true;
        req.session.adminId = admin._id;
        req.flash('success_msg', 'Ви успішно увійшли в систему');
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error during login');
        res.redirect('/admin/login');
    }
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            products
        });
    } catch (error) {
        req.flash('error_msg', 'Error loading dashboard');
        res.redirect('/admin/login');
    }
});

router.get('/products/add', ensureAuthenticated, (req, res) => {
    res.render('admin/add-product', {
        title: 'Add Product'
    });
});

router.post('/products/add', ensureAuthenticated, async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            category, 
            image,
            weight,
            weightUnit,
            country,
            brand,
            ingredients,
            inStock 
        } = req.body;

        const newProduct = new Product({
            name,
            description,
            price: Number(price),
            category,
            image,
            weight: Number(weight),
            weightUnit,
            country,
            brand: brand || 'Не вказано',
            ingredients: ingredients || 'Не вказано',
            inStock: !!inStock
        });await newProduct.save();
        req.flash('success_msg', 'Товар успішно додано');
        res.redirect('/admin/dashboard');
    } catch (error) {
        req.flash('error_msg', 'Помилка при додаванні товару');
        res.redirect('/admin/products/add');
    }
});

router.get('/products/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('admin/edit-product', {
            title: 'Edit Product',
            product
        });
    } catch (error) {
        req.flash('error_msg', 'Error loading product');
        res.redirect('/admin/dashboard');
    }
});

router.post('/products/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            category, 
            image,
            weight,
            weightUnit,
            country,
            brand,
            ingredients,
            inStock 
        } = req.body;

        await Product.findByIdAndUpdate(req.params.id, {
            name,
            description,
            price: Number(price),
            category,
            image,
            weight: Number(weight),
            weightUnit,
            country,
            brand: brand || 'Не вказано',
            ingredients: ingredients || 'Не вказано',
            inStock: !!inStock
        });req.flash('success_msg', 'Товар успішно оновлено');
        res.redirect('/admin/dashboard');
    } catch (error) {
        req.flash('error_msg', 'Помилка при оновленні товару');
        res.redirect('/admin/dashboard');
    }
});

router.post('/products/delete/:id', ensureAuthenticated, async (req, res) => {
    try {        await Product.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Товар успішно видалено');
        res.redirect('/admin/dashboard');
    } catch (error) {
        req.flash('error_msg', 'Помилка при видаленні товару');
        res.redirect('/admin/dashboard');
    }
});

router.get('/orders', ensureAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.render('admin/orders', {
            title: 'Управління замовленнями',
            orders
        });
    } catch (error) {
        req.flash('error_msg', 'Помилка при завантаженні замовлень');
        res.redirect('/admin/dashboard');
    }
});

router.post('/orders/:id/status', ensureAuthenticated, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            req.flash('error_msg', 'Замовлення не знайдено');
            return res.redirect('/admin/orders');
        }

        const oldStatus = order.status;
        if (oldStatus !== status) {
            order.status = status;
            order.statusUpdatedAt = new Date();
            await order.save();
            
            try {
                await sendStatusUpdate(order);
                console.log(`Status update email sent for order ${order._id}`);
            } catch (emailError) {
                console.error('Error sending status update email:', emailError);
            }
        }

        req.flash('success_msg', 'Статус замовлення оновлено');
        res.redirect('/admin/orders');
    } catch (error) {
        console.error('Error updating order status:', error);
        req.flash('error_msg', 'Помилка при оновленні статусу');
        res.redirect('/admin/orders');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

module.exports = router;
