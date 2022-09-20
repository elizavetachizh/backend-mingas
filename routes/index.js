var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Home Page');
  console.log(req.headers);
   var schema = req.headers["x-forwarded-proto"];
   console.log(schema)
});

module.exports = router;
