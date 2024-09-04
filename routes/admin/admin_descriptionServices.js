import express from "express";
const adminDescriptionRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import {
  createDescriptionService,
  deleteDescriptionService,
  getDescriptionServiceById,
  getDescriptionServices,
  updateDescriptionService,
} from "../../controllers/descriptionService.js";

adminDescriptionRouter.get("/", isAdmin, getDescriptionServices);
adminDescriptionRouter.get("/add-description", isAdmin, function (req, res) {
  var inform = "";
  var nameDescription = "";

  res.render("admin/add_description", {
    inform,
    nameDescription,
  });
});
adminDescriptionRouter.post("/add-description", createDescriptionService);
adminDescriptionRouter.get(
  "/edit-description/:id",
  isAdmin,
  getDescriptionServiceById
);
adminDescriptionRouter.post("/edit-description/:id", updateDescriptionService);
adminDescriptionRouter.get(
  "/delete-description/:id",
  isAdmin,
  deleteDescriptionService
);

export default adminDescriptionRouter;
