const express = require("express");
const router = express.Router();
const uploadController = require("../../controllers/documentsEDI");
const { isAdmin } = require("../../config/auth");
router.get("/create", isAdmin, uploadController.home);
router.post("/create", uploadController.uploadFiles);
router.get("/", uploadController.getListFiles);
router.get("/files/:name", uploadController.download);
router.get("/delete/:id", uploadController.deleteInfo);

module.exports = router;