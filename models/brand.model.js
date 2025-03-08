const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Brand title is Required"],
      unique: [true, "Brand title is Unique"],
      minLength: [3, "Brand title must be at least 3 characters"],
      maxLength: [32, "Brand title must be at most 20 characters"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

BrandSchema.post("init", (doc) => {
  setImageURL(doc);
});

BrandSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Brand", BrandSchema);
