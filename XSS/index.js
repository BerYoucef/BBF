const express = require('express');
const router = express.Router();
const path = require('path');

const shop = require('./routes/home0');
router.use('/', shop);

const home0 = require('./routes/home');
router.use('/product', home0);

const thanks = require ('./routes/thanks');
router.use('/thanks', thanks);

router.use('/img', express.static(path.join(__dirname, '/lab2styles/img')));


module.exports = router;