const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
  submittedAt: { type: Date, default: Date.now },
  response: { type: Array },
});

const FolderOrFormSchema = new mongoose.Schema(
  {
    isFolder: { type: Boolean, default: false, required: true },
    name: { type: String, required: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "FolderOrForm" }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: { type: Array },
    viewed: { type: Number },
    started: { type: Number },
    responses: [ResponseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FolderOrForm", FolderOrFormSchema);
