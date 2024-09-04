import express from "express";
const tendersAdminRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import {
  createTender,
  deleteTender,
  getTenderById,
  getTenders,
  updateTender,
} from "../../controllers/tenders.js";
tendersAdminRouter.get("/", isAdmin, getTenders);
tendersAdminRouter.get("/add-tender", isAdmin, function (req, res) {
  var content = "";
  res.render("admin/add_tenders", {
    content,
  });
});
tendersAdminRouter.post("/add-tender", createTender);
tendersAdminRouter.get("/edit-tender/:id", getTenderById);
tendersAdminRouter.post("/edit-tender/:id", updateTender);
tendersAdminRouter.get("/delete-tender/:id", isAdmin, deleteTender);

export default tendersAdminRouter;
