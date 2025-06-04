const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, country } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (country) {
            query.country = country;
        }

        const products = await Product.find(query);
        
        const categories = await Product.distinct('category');
        const countries = await Product.distinct('country');

        res.render('products/index', { 
            products,
            categories,
            countries,
            filters: req.query 
        });
    } catch (error) {
        req.flash('error_msg', 'Помилка при завантаженні товарів');
        res.redirect('/');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error_msg', 'Товар не знайдено');
            return res.redirect('/products');
        }
        res.render('products/show', { 
            product,
            title: `${product.name} - Деталі товару`
        });
    } catch (error) {
        req.flash('error_msg', 'Помилка при завантаженні товару');
        res.redirect('/products');
    }
});

module.exports = router;
