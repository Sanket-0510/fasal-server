const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  runtime: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: null,
  },
  ratings: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    default: null,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  list_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
    required: true,
  },
});

const Movies = mongoose.model("Movie", movieSchema);
module.exports = Movies;
