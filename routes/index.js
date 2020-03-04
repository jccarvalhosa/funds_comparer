const express = require('express');

/** @type {Router} */
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {page:'Home', menuId:'home'});
});

module.exports = router;
