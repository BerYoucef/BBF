const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {readDB, writeDB} = require('../models/Product-Model')


router.get('/', (req, res) => {
    const products = readDB();
    const query = ' ';
    console.log(products)
    res.render("home", {
        title: "BBF Shop",
        pageCSS: ['/css/lab2.css', '/css/shop.css', '/css/search.css'],
        layout: 'layout',
        products: products,
        query: query,
    })
});

router.get('/search', (req,res) => {
    const q = req.query.q || ' ';
    const products = readDB();
    const result = products.filter(p => {
        return p.name.toLowerCase().includes(q)
    });
    
    
    res.render('home', {
        title: "BBF Shop",
        pageCSS: ['/css/lab2.css', '/css/shop.css', '/css/search.css'],
        layout: 'layout',
        products: result,
        query: q,
    })

})


module.exports = router;