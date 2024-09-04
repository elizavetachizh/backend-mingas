import express from "express";
const articlesRouter = express.Router();
import mainArticle from "../../models/mainArticles.js";

articlesRouter.get("/", function (req, res) {
  mainArticle
    .find()
    .sort({ _id: -1 })
    .exec(function (err, articles) {
      res.send(articles);
    });
});
export default articlesRouter;
