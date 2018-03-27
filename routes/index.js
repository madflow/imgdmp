const express = require('express');
const router = express.Router();
const pkg = require('../package.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  res.render('index', { title: pkg.name, fullUrl: fullUrl });
});

module.exports = router;
