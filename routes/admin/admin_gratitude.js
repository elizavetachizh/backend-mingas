import express from "express";
import {
  home,
  getListGratitude,
  download,
  deleteInfo,
  uploadGratitude,
} from "../../controllers/gratitude.js";
const adminGratitudeRouter = express.Router();
import { isAdmin } from "../../config/auth.js";

adminGratitudeRouter.get("/create", isAdmin, home);
adminGratitudeRouter.post("/create", uploadGratitude);
adminGratitudeRouter.get("/", getListGratitude);
adminGratitudeRouter.get("/:name", download);
adminGratitudeRouter.get("/delete/:id", deleteInfo);

export default adminGratitudeRouter;
