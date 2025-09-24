const path = require('path');
const {readDB, writeDB} = require('../models/Product-Model')
const {escapeHtml, escapeJsonValues} = require('../utils/html-escaping')

function ShowProductPage(req, res) {
    const productID = parseInt(req.query.productid); /* get param from query  */
    const products = readDB()
    const product = products.find(p => p.id === productID);
    if(!product) return res.status(404).send('product not found');
    
    const escapedProduct = escapeJsonValues(product);

    res.render('products', {
        title: 'Reflected XSS Lab 002 - BBF',
        pageCSS: '/css/lab2.css',
        layout: 'layout',
        product: escapedProduct,
    })
}

function SubmitComment(req, res) {
    const data = readDB();
    const productID = parseInt(req.body.productid); /* get param from body  */ 
    const productIndex = data.findIndex(p => p.id === productID);
    if(productIndex === -1) {
        return res.status(404).send('product not found')
    };

    const comment = req.body.comment;
    const name = req.body.name;
    const rating = req.body.rating;
    const avatar = name.charAt(0).toUpperCase();
    const date = new Date().toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    if(!data[productIndex].comments) {   
        data[productIndex].comments = [];
    }


    data[productIndex].comments.push({
            name,
            avatar,
            stars: rating,
            comment,
            date,
    });
    writeDB(data);
    res.redirect('/thanks');

}

module.exports = {ShowProductPage, SubmitComment};