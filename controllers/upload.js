import uploadFilesMiddleware from "../middleware/upload.js";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import { keys } from "../keys/index.js";
const mongoClient = new MongoClient(keys.MONGODB_URI);

export const home = async (req, res) => {
  var files = "";
  await res.render("admin/add_photos", {
    files,
  });
};
export const uploadFiles = async (req, res) => {
  try {
    await uploadFilesMiddleware(req, res);
    if (req.file.length <= 0) {
      return res
        .status(400)
        .send({ message: "You must select at least 1 file." });
    }
    if (res.status(200)) {
      // Move the file to the desired location
      res.redirect("/admin/upload/files");
    }
  } catch (error) {
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
    const images = database.collection(keys.imgBucket + ".files");
    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).render("admin/admin_photos", {
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        uploadDate: doc.uploadDate,
        url: "https://back.mingas.by/admin/upload/files/" + doc.filename,
        id: doc._id,
      });
    });

    const files = fileInfos.sort(
      (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
    );
    res.status(200).render("admin/admin_photos", {
      fileInfos: files,
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

export const deleteInfo = async (req, res) => {
  try {
    const database = mongoClient.db(keys.database);
    const bucket = new GridFSBucket(database, {
      bucketName: keys.imgBucket,
    });

    bucket.delete(new ObjectId(req.params.id), function (err) {
      if (err) return console.log(err);
    });
    res.redirect("/admin/upload/files");
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
