import util from "util";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { keys } from "../keys/index.js";
var storage = new GridFsStorage({
  url: keys.MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = [
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${file.originalname}`;
      const url =
        "https://back.mingas.by/admin/admin_prices/" + `${file.originalname}`;
      return { filename, url };
    }
    return {
      bucketName: "prices",
      filename: `${file.originalname}`,
      url:
        "https://back.mingas.by/admin/admin_prices/" + `${file.originalname}`,
    };
  },
});

const uploadPrices = multer({ storage }).single("file");
const uploadPricesMiddleware = util.promisify(uploadPrices);
export default uploadPricesMiddleware;
