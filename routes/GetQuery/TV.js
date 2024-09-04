import express from "express"
const TVRouter = express.Router();
import MingasTV from "../../models/mingasTV.js";

TVRouter.get("/", function (req, res) {
  MingasTV.find(function (err, info) {
    res.send(info);
  });
});
export default TVRouter
