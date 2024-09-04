import express from "express";
const adminPricesRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import {
  deletePrice,
  download,
  getListPrices,
  home,
  uploadPrice,
} from "../../controllers/prices.js";
adminPricesRouter.get("/", isAdmin, getListPrices);
adminPricesRouter.get("/add-prices", isAdmin, home);
adminPricesRouter.post("/add-prices", uploadPrice);
adminPricesRouter.get("/:name", download);
adminPricesRouter.get("/delete-prices/:id", deletePrice);

export default adminPricesRouter;
