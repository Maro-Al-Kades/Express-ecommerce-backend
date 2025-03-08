const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Logo", logoSchema);
