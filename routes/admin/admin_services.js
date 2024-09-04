import express from "express";
const adminServicesRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import Description from "../../models/descriptionServices.js";
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from "../../controllers/services.js";

adminServicesRouter.get("/", isAdmin, getServices);
adminServicesRouter.get("/add-services", isAdmin, async (req, res) => {
  const description = await Description.find();
  const name = "";
  const type = "";
  res.render("admin/add_services", { name, type, description });
});
adminServicesRouter.post("/add-services", createService);
adminServicesRouter.get("/edit-services/:id", isAdmin, getServiceById);
adminServicesRouter.post("/edit-services/:id", updateService);
adminServicesRouter.get("/delete-services/:id", isAdmin, deleteService);

export default adminServicesRouter;
