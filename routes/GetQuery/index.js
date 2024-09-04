import express from "express";
import Page from "../../models/page.js";
var adminRouter = express.Router();

/* GET home page. */
adminRouter.get("/", function (req, res) {
  Page.findOne({ slug: "home" }, function (err, page) {
    if (err) console.log(err);

    res.render("index", {
      title: page.title,
      content: page.content,
    });
  });
});
export default adminRouter;
