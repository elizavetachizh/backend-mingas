import express from "express";
import UsefulResources from "../../models/usefulResources.js";
const usefulResourcesRouter = express.Router();
usefulResourcesRouter.get("/", function (req, res) {
  UsefulResources.find(function (err, posts) {
    res.send(posts);
  });
});

usefulResourcesRouter.get("/:id", function (req, res) {
  UsefulResources.findById(req.params.id, function (err, post) {
    if (err) return console.log(err);
    res.send(post);
  });
});
export default usefulResourcesRouter;
