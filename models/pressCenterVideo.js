import mongoose from "mongoose";

const PressCenterVideoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const PressCenterVideo = mongoose.model("PressCenterVideo", PressCenterVideoSchema);

export default PressCenterVideo;

