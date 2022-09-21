var express = require("express");
const fs = require("fs");
var router = express.Router();
const multer = require("multer")
const upload = multer({dest: 'public/images'})
/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Home Page");
  res.download("./public/images" + req.params.path);
});
router.post('/', upload.single('image'), (req, res, next)=>{
  console.log(req.file)

})
module.exports = router;
