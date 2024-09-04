import express from "express";
const administrativeServicesRouter = express.Router();
import AdministrativeServices from "../../models/administrativeServices.js";

administrativeServicesRouter.get("/", function (req, res) {
  AdministrativeServices.find(function (err, administration) {
    res.send(administration);
  });
});
export default administrativeServicesRouter;
