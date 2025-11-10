import express from "express";
const pressCenterVideoRouter = express.Router();
import PressCenterVideo from "../../models/pressCenterVideo.js";

pressCenterVideoRouter.get("/", function (req, res) {
  PressCenterVideo.find()
    .sort({ _id: -1 })
    .exec(function (err, videos) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.send(videos);
    });
});

export default pressCenterVideoRouter;
