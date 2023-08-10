const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

var storage = new GridFsStorage({
  url: "mongodb+srv://elizavetachizh:mwSF7rcHYSd0XO2Z@cluster0.ct1ltqh.mongodb.net/?retryWrites=true&w=majority",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${file.originalname}`;
      const url =
        "http://localhost:3000/admin/upload/files/" +
        `${Date.now()}-${file.originalname}`;
      return { filename, url };
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-${file.originalname}`,
      url:
        "http://localhost:3000/admin/upload/files/" +
        `${Date.now()}-${file.originalname}`,
    };
  },
});

var uploadFiles = multer({ storage: storage }).array("file", 10);
// var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
