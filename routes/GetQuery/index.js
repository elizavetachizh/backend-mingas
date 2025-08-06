import express from "express";
import Page from "../../models/page.js";
const adminRouter = express.Router();

/* GET home page. */
adminRouter.get("/", function (req, res) {
  if (
    req.isAuthenticated() &&
    res.locals.user?.admin === 2 &&
    req.path !== "/admin/new_posts"
  ) {
    return res.redirect("/admin/new_posts");
  } else {
    Page.findOne({ slug: "home" }, function (err, page) {
      if (err) console.log(err);

      res.render("index", {
        title: page.title,
        content: page.content,
      });
    });
  }
});
export default adminRouter;
