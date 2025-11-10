import express from "express";
const adminPressCenterVideoRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import {
  getPressCenterVideos,
  createPressCenterVideo,
  getPressCenterVideoById,
  updatePressCenterVideo,
  deletePressCenterVideo,
} from "../../controllers/pressCenterVideo.js";

adminPressCenterVideoRouter.get("/", isAdmin, getPressCenterVideos);

/*
 * GET add video
 */
adminPressCenterVideoRouter.get("/add-info", isAdmin, function (req, res) {
  var name = "";
  var link = "";
  res.render("admin/pressCenterVideo/add_pressCenterVideo", {
    name,
    link,
  });
});

adminPressCenterVideoRouter.post("/add-info", createPressCenterVideo);

/*
 * GET edit video
 */
adminPressCenterVideoRouter.get("/edit-info/:id", isAdmin, getPressCenterVideoById);

/*
 * POST edit video
 */
adminPressCenterVideoRouter.post("/edit-info/:id", updatePressCenterVideo);

/*
 * GET delete video
 */
adminPressCenterVideoRouter.get("/delete-info/:id", isAdmin, deletePressCenterVideo);

export default adminPressCenterVideoRouter;
