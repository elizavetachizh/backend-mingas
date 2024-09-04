import util from "util";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { keys } from "../keys/index.js";
var storage = new GridFsStorage({
  url: keys.MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg", "image/webp"];
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${file.originalname}`;
      const url =
        "https://back.mingas.by/admin/gratitude/" + `${file.originalname}`;
      return { filename, url };
    }
    return {
      bucketName: "gratitude",
      filename: `${file.originalname}`,
      url:
        "https://back.mingas.by/admin/gratitude/" +
        `${Date.now()}-${file.originalname}`,
    };
  },
});

const uploadGratitude = multer({ storage }).single("file");
const uploadGratitudeMiddleware = util.promisify(uploadGratitude);
export default uploadGratitudeMiddleware;
