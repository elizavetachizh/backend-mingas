import util from "util";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { keys } from "../keys/index.js";
var storage = new GridFsStorage({
  url: keys.MONGODB_URI,
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
      const filename = `${file.originalname}`;
      const url = `https://back.mingas.by/admin/edi/files/${file.originalname}`;
      return { filename, url };
    }
    return {
      bucketName: "documents",
      filename: file.originalname,
      url: `https://back.mingas.by/admin/edi/files/${file.originalname}`,
    };
  },
});

var uploadFiles = multer({ storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
export default uploadFilesMiddleware;
