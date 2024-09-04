import express from "express";
import { keys } from "../../keys/index.js";
import { MongoClient } from "mongodb";
const gratitudeRouter = express.Router();
const mongoClient = new MongoClient(keys.MONGODB_URI);
gratitudeRouter.get("/", async function (req, res) {
  const database = mongoClient.db(keys.database);
  const images = database.collection(keys.gratitudeBucket + ".files");
  const cursor = images.find().sort({ _id: -1 });
  let files = [];
  await cursor.forEach((doc) => {
    files.push({
      name: doc.filename,
      url: "https://back.mingas.by/admin/gratitude/" + doc.filename,
      id: doc._id,
    });
  });
  res.send(files);
});
export default gratitudeRouter;
