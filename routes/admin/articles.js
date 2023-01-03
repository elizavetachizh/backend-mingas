const express = require("express");
const router = express.Router();
const mainArticle = require("../../models/mainArticles");

router.get("/", function (req, res) {
    mainArticle.find(function (err, articles) {
        res.send(articles);
    });
});
module.exports = router;
