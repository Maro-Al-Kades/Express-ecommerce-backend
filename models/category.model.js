const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is Required"],
      unique: [true, "Category title is Unique"],
      minLength: [3, "Category title must be at least 3 characters"],
      maxLength: [32, "Category title must be at most 20 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

CategorySchema.post("init", (doc) => {
  setImageURL(doc);
});

CategorySchema.post("save", (doc) => {
  setImageURL(doc);
});

const categoryModel = mongoose.model("Category", CategorySchema);

module.exports = categoryModel;
