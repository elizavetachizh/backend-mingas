import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Number,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
