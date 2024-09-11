const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  bio: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Courses",
  },
});

module.exports = mongoose.model("User", userSchema);
