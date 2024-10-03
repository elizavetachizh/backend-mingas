import { MongoClient, GridFSBucket, ObjectId } from "mongodb"
import uploadEDIFilesMiddleware from "../middleware/documentsEDI.js";
import { keys } from "../keys/index.js";
const mongoClient = new MongoClient(keys.MONGODB_URI);

export const home = (req, res) => {
  var files = "";
  res.render("admin/add_edi", {
    files,
  });
};
export const uploadFiles = async (req, res) => {
  try {
    await uploadEDIFilesMiddleware(req, res);
    if (req.file.length <= 0) {
      return res
        .status(400)
        .send({ message: "You must select at least 1 file." });
    }
    if (res.status(200)) {
      // Move the file to the desired location
      res.redirect("/admin/edi");
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

export const getListFiles = async (req, res) => {
  try {
    const database = mongoClient.db(keys.database);
    const images = database.collection(keys.documentsBucket + ".files");
    const cursor = images.find().sort({ _id: -1 });

    let files = [];
    await cursor.forEach((doc) => {
      files.push({
        name: doc.filename,
        url: "https://back.mingas.by/admin/edi/files/" + doc.filename,
        id: doc._id,
      });
    });
    res.status(200).render("admin/admin_edi", {
      files,
    });

  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

export const download = async (req, res) => {
  try {
    const database = mongoClient.db(keys.database);
    const bucket = new GridFSBucket(database, {
      bucketName: keys.documentsBucket,
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

export const deleteInfo = async (req, res) => {
  try {
    const database = mongoClient.db(keys.database);
    const bucket = new GridFSBucket(database, {
      bucketName: keys.documentsBucket,
    });

    bucket.delete(new ObjectId(req.params.id), function (err) {
      if (err) return console.log(err);
    });
    res.redirect("/admin/edi");
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

