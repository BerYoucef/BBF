const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
    console.log("✅ thanks route hit");
    res.set('Cache-Control', 'no-store');
    res.render('thanks', {
        title: 'Thanks!',
        pageCSS: '/css/lab2.css',
        layout: 'layout.ejs'
    })
})

module.exports = router;
