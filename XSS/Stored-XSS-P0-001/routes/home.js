const express = require('express');
const router = express.Router();
const {ShowProductPage, SubmitComment} = require('../controllers/ProductController');

router.get('/', ShowProductPage);
router.post('/submit-comment', SubmitComment);


module.exports = router;




