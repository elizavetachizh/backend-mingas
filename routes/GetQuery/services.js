import express from "express";
import Services from "../../models/services.js";
const ServicesRouter = express.Router();
ServicesRouter.get("/", function (req, res) {
  Services.find({}, { name: 1, type: 1, image: 1 }).exec(function (
    err,
    services
  ) {
    if (err) {
      console.log(err);
    }
    res.send(services);
  });
});

ServicesRouter.get("/:id", function (req, res) {
  Services.findById(req.params.id)
    .populate({ path: "description", select: "inform nameDescription" })
    .exec(function (err, services) {
      if (err) {
        console.log(err);
      }
      res.send(services);
    });
});

export default ServicesRouter;
