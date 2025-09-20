const path = require('path');
const {readDB, writeDB} = require('../models/Product-Model')

function ShowProductPage(req, res) {
    const productID = parseInt(req.query.productid); /* get param from query  */
    const products = readDB()
    const product = products.find(p => p.id === productID);
    if(!product) return res.status(404).send('product not found');
    

    res.render('home', {
        title: 'Stored XSS Lab - Threat\'D\'en',
        pageCSS: '/css/lab2.css',
        layout: 'layout-lab2',
        product: product,
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

    if(!data[productIndex].comments) {    /* data[productIndex] => index just liek data[0] or data[1] ...etc */
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
