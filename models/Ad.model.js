const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
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
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AD", adSchema);
