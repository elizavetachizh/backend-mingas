import express from "express";
import BusinessTabsModel from "../../models/tabsForBusiness.js";

const businessTabsRouter = express.Router();

businessTabsRouter.get("/", function (req, res) {
  BusinessTabsModel.find(function (err, description) {
    if (err) {
      console.log(err);
    }
    res.send(description);
  });
});
export default businessTabsRouter