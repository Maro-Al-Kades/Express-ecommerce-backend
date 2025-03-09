const mongoose = require("mongoose");

const coverSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    title: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cover", coverSchema);
