import express from "express";
import ThemeOfEcoBoxModel from "../../../models/ecobox/themes/index.js";

const ecoBoxThemesRouter = express.Router();
ecoBoxThemesRouter.get("/", async function (req, res) {
  ThemeOfEcoBoxModel.find(function (err, content) {
    res.send(content);
  });
});
export default ecoBoxThemesRouter;
