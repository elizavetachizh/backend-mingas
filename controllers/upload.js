const upload = require("../middleware/upload");
const { MongoClient, GridFSBucket } = require("mongodb");
const keys = require("../keys");
const path = require("path");
const mongoClient = new MongoClient(keys.MONGODB_URI);

const home = (req, res) => {
  return res.sendFile(path.join(`${__dirname}/../views/admin/add_images.html`));
};
const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    if (req.files.length <= 0) {
      return res
        .status(400)
        .send({ message: "You must select at least 1 file." });
    }
    if (res.status(200)) {
      res.redirect("/admin/upload/files");
    }
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send({
        message: "Too many files to upload.",
      });
    }
    return res.status(500).send({
      message: `Error when trying upload many files: ${error}`,
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    const database = mongoClient.db(keys.database);
    const images = database.collection(keys.imgBucket + ".files");
    const cursor = images.find({});
    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: "http://localhost:3000/admin/upload/files/" + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const download = async (req, res) => {
  try {
    const database = mongoClient.db(keys.database);
    const bucket = new GridFSBucket(database, {
      bucketName: keys.imgBucket,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  uploadFiles,
  getListFiles,
  download,
  home,
};
