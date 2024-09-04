import express from "express";
const managementRouter = express.Router();
import Management from "../../models/management.js";
managementRouter.get("/", async function (req, res) {
  const management = await Management.find().populate("department");

  res.send(management);
});

export default managementRouter;
