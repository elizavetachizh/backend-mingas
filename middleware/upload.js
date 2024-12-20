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
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "video/mp4",
    ];
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${file.originalname}`;
      const url =
        "https://back.mingas.by/admin/upload/files/" +
        `${Date.now()}-${file.originalname}`;
      return { filename, url };
    }
    return {
      bucketName: "photos",
      filename: `${Date.now()}-${file.originalname}`,
      url:
        "https://back.mingas.by/admin/upload/files/" +
        `${Date.now()}-${file.originalname}`,
    };
  },
});

const uploadFiles = multer({ storage }).single("file");
const uploadFilesMiddleware = util.promisify(uploadFiles);
export default uploadFilesMiddleware;
