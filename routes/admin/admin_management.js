import { isAdmin } from "../../config/auth.js";
import express from "express";

import Departament from "../../models/departaments.js";
import {
  createManagement,
  deleteManagement,
  getManagement,
  getManagementById,
  updateManagement,
} from "../../controllers/management.js";
const managementAdminRouter = express.Router();

managementAdminRouter.get("/", isAdmin, getManagement);
managementAdminRouter.get("/add-men", isAdmin, async (req, res) => {
  const department = await Departament.find();
  res.render("admin/add_management", {
    fullName: "",
    position: "",
    image: "",
    department: department,
    contact_phone: "",
  });
});
managementAdminRouter.post("/add-men", createManagement);
managementAdminRouter.get("/edit-men/:id", isAdmin, getManagementById);
managementAdminRouter.post("/edit-men/:id", updateManagement);

/*
 * GET delete product
 */
managementAdminRouter.get("/delete-men/:id", isAdmin, deleteManagement);

export default managementAdminRouter;
