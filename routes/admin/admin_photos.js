const express = require("express");
const router = express.Router();
const uploadController = require("../../controllers/upload");
const { isAdmin } = require("../../config/auth");
router.get("/", isAdmin, uploadController.home);
router.post("/", uploadController.uploadFiles);
router.get("/files", uploadController.getListFiles);
router.get("/files/:name", uploadController.download);
router.get("/delete/:id", uploadController.deleteInfo);

module.exports = router;
