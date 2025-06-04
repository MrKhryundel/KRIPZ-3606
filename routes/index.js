const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('index', { 
            title: 'Food Store',
            products: products 
        });
    } catch (error) {
        req.flash('error_msg', 'Error loading products');
        res.redirect('/');
    }
});

module.exports = router;
