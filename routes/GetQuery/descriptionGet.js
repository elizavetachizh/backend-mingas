import express from "express";
import Description from "../../models/descriptionServices.js";
const DescriptionRouter = express.Router();

DescriptionRouter.get("/", function (req, res) {
  Description.find(function (err, description) {
    if (err) {
      console.log(err);
    }
    res.send(description);
  });
});
DescriptionRouter.get("/:id", function (req, res) {
  Description.findById(req.params.id, function (err, description) {
    if (err) {
      console.log(err);
    }
    res.send(description);
  });
});
export default DescriptionRouter;
