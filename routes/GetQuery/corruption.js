import express from "express";
const corruptionRouter = express.Router();
import Corruption from "../../models/corruption.js";

corruptionRouter.get("/", function (req, res) {
  Corruption.find(function (err, posts) {
    res.send(posts);
  });
});

/*
 * GET edit page
 */
corruptionRouter.get("/:link", function (req, res) {
  Corruption.findById(req.params.link, function (err, post) {
    if (err) return console.log(err);
    res.send(post);
  });
});

export default corruptionRouter;
