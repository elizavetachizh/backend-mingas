import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import { keys } from "../keys/index.js";
import uploadPricesMiddleware from "../middleware/prices.js";
const mongoClient = new MongoClient(keys.MONGODB_URI);

export const home = async (req, res) => {
  var files = "";
  await res.render("admin/add_prices", {
    files,
  });
};
export const uploadPrice = async (req, res) => {
  try {
    await uploadPricesMiddleware(req, res);
    if (req.file.length <= 0) {
      return res
        .status(400)
        .send({ message: "You must select at least 1 file." });
    }
    if (res.status(200)) {
      // Move the file to the desired location
      res.redirect("/admin/admin_prices");
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

export const getListPrices = async (req, res) => {
  try {
    const database = mongoClient.db(keys.database);
    const price = database.collection(keys.pricesBucket + ".files");
    const cursor = price.find({});
    const count = await cursor.count();
    if ((await cursor.count()) === 0) {
      return res.status(500).render("admin/admin_prices", {
        message: "No files found!",
      });
    }
    let files = [];
    await cursor.forEach((doc) => {
      files.push({
        name: doc.filename,
        url: "https://back.mingas.by/admin/admin_prices/" + doc.filename,
        id: doc._id,
      });
    });
    res.status(200).render("admin/admin_prices", {
      count,
      files,
    });
  } catch (error) {
    return res.status(500).render("admin/admin_prices", {
      message: error.message,
    });
  }
};

export const download = async (req, res) => {
  try {
    const database = mongoClient.db(keys.database);
    const bucket = new GridFSBucket(database, {
      bucketName: keys.pricesBucket,
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

export const deletePrice = async (req, res) => {
  try {
    const database = mongoClient.db(keys.database);
    const bucket = new GridFSBucket(database, {
      bucketName: keys.pricesBucket,
    });

    bucket.delete(new ObjectId(req.params.id), function (err) {
      if (err) return console.log(err);
    });
    res.redirect("/admin/admin_prices");
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
