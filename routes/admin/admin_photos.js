const express = require("express");
const router = express.Router();
const path = require("path");
const uploadController = require("../../controllers/upload");
const { isAdmin } = require("../../config/auth");
router.get("/", isAdmin, uploadController.home);
router.post("/", uploadController.uploadFiles);
router.get("/files", isAdmin, uploadController.getListFiles);
router.get("/files/:name", uploadController.download);

module.exports = router;
