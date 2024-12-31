const mongoose = require("mongoose");

const userShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    spaces: [
      {
        space: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Space",
          required: true,
        },
        canEdit: { type: Boolean, default: false },
        isOwner: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userShema);
