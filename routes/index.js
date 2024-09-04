import express from "express";
const indexRouter = express.Router();

/* GET home page. */
indexRouter.get("/", function (req, res, next) {
  // res.send("Панель администратора");
  res.redirect("/admin");
});
export default indexRouter;
