import express from "express";
import { isPostsUser } from "../../../config/auth.js";
import {
  createTheme,
  deleteTheme,
  getTheme,
  getThemeById,
  updateTheme,
} from "../../../controllers/ecobox/theme.js";

const adminEcoBoxThemeRouter = express.Router();

adminEcoBoxThemeRouter.get("/", isPostsUser, getTheme);
adminEcoBoxThemeRouter.get("/add-content", isPostsUser, async (req, res) => {
  res.render("admin/ecobox/theme/add_info", {
    title: "",
  });
});
adminEcoBoxThemeRouter.post("/add-content", createTheme);
adminEcoBoxThemeRouter.get("/edit-content/:id", isPostsUser, getThemeById);
adminEcoBoxThemeRouter.post("/edit-content/:id", updateTheme);

/*
 * GET delete product
 */
adminEcoBoxThemeRouter.get("/delete-content/:id", isPostsUser, deleteTheme);

export default adminEcoBoxThemeRouter;
