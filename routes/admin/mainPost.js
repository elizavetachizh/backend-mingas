const mainPosts = require("../../models/mainPosts");
const express = require("express");
const router = express.Router();
router.get("/", function (req, res) {
    var count;
    mainPosts.count(function (err, c) {
        count = c;
    });
    mainPosts.find(function (err, posts) {
       res.send(posts)
    });
});
module.exports = router;
