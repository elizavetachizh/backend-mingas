import express from "express";
import ThemeOfEcoBoxModel from "../../../models/ecobox/themes/index.js";

const ecoBoxThemesRouter = express.Router();
ecoBoxThemesRouter.get("/", async function (req, res) {
  ThemeOfEcoBoxModel.find()
    .sort({ _id: -1 })
    .exec(function (err, prices) {
      res.send(prices);
    });
});
export default ecoBoxThemesRouter;
