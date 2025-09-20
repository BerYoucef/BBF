const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {readDB, writeDB} = require('../models/Product-Model')



router.get('/', (req, res) => {
    const products = readDB();
    console.log(products)
    res.render("home0", {
        title: "Threat'D'en Shop",
        pageCSS: ['/css/lab2.css', '/css/shop.css', '/css/search.css'],
        layout: 'layout-lab2',
        products: products
    })
});

router.get('/api/products', (req, res) => {
    const products = readDB();
    res.json(products)
})

module.exports = router;