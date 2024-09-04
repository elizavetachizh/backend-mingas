import express from "express"
import Table from "../../models/tableReceptionSchedule.js"

const tableRouter = express.Router();
tableRouter.get("/", function (req, res) {
  Table.find(function (err, documents) {
    if (err) {
      console.log(err);
    }
    res.send(documents);
  });
});
export default tableRouter;
