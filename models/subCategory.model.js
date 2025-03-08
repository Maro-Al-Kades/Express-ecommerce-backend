const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: [true, "SubCategory must be unique"],
      required: [true, "Subcategory title is required"],
      minlength: [2, "Subcategory title must be at least 2 characters"],
      maxlength: [32, "Subcategory title must be at most 32 characters"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must be blong to parent category"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
