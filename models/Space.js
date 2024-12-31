const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  rootFolder: [{ type: mongoose.Schema.Types.ObjectId, ref: "FolderOrForm" }],
});

module.exports = mongoose.model("Space", spaceSchema);
