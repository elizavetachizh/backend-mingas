import express from "express";
import EcoBoxModel from "../../../models/ecobox/info/index.js";
import ThemeOfEcoBoxModel from "../../../models/ecobox/themes/index.js";
import mongoose from "mongoose";

const ecoBoxContentRouter = express.Router();
ecoBoxContentRouter.get("/", async function (req, res) {
  try {
    const { theme } = req.query;
    console.log("Received theme ID:", theme); // Логируем полученный ID
    // Строим запрос
    const query = EcoBoxModel.find({}).populate("theme");

    // Если передан параметр theme, добавляем фильтрацию
    if (theme) {
      // Проверяем, что theme - валидный ObjectId
      if (!mongoose.Types.ObjectId.isValid(theme)) {
        return res.status(400).json({ error: "Invalid theme ID" });
      }
      console.log("Checking if theme exists...");
      // Проверяем существование темы
      const themeExists = await ThemeOfEcoBoxModel.findById(theme);
      if (!themeExists) {
        return res.status(404).json({ error: "Theme not found" });
      }

      query.where("theme").equals(theme);
    }

    // Выполняем запрос
    const content = await query.exec();
    res.json(content);
  } catch (err) {
    console.error("Error fetching eco box content:", err);
    res.status(500).json({ error: "Server error" });
  }
});
export default ecoBoxContentRouter;
