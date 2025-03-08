const mongoose = require("mongoose");

const coverSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Cover", coverSchema);
