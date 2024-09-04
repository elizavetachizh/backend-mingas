import { isAdmin } from "../../config/auth.js";
import express from "express";
import Management from "../../models/management.js";
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartmentById,
  updateDepartment,
} from "../../controllers/departments.js";
const departamentAdminRouter = express.Router();

departamentAdminRouter.get("/", isAdmin, getDepartment);
departamentAdminRouter.get("/add-departament", isAdmin, function (req, res) {
  var name = "",
    chief = "",
    description = "",
    schedule = "",
    contacts = "";
  Management.find(function (err, management) {
    res.render("admin/add_departament", {
      name,
      nameMen: management,
      chief,
      description,
      schedule,
      contacts,
    });
  });
});
departamentAdminRouter.post("/add-departament", createDepartment);
departamentAdminRouter.get("/edit-departament/:id", isAdmin, getDepartmentById);

/*
 * POST edit product
 */
departamentAdminRouter.post("/edit-departament/:id", updateDepartment);

/*
 * GET delete product
 */
departamentAdminRouter.get(
  "/delete-departament/:id",
  isAdmin,
  deleteDepartment
);

export default departamentAdminRouter;
