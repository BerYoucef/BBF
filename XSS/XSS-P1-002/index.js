const express = require("express");
const router = express.Router();
const path = require("path");

const home = require('./routes/home');
router.use('/', home)

const products = require('./routes/products');
router.use('/product', products);

const thanks = require ('./routes/thanks');
router.use('/thanks', thanks);


module.exports = router