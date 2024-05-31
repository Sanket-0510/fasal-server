const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  listName: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const List = mongoose.model("List", listSchema);
module.exports = List;
