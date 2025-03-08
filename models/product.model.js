const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product Title is Required"],
      trim: true,
      minLength: [3, "Product Title must be at least 3 characters"],
      maxLength: [100, "Product Title must be at most 100 characters"],
    },

    slug: {
      type: String,
      lowercase: true,
      required: true,
    },

    description: {
      type: String,
      required: [true, "Product Description is Required"],
      minLength: [20, "Product Description must be at least 20 characters"],
      maxLength: [500, "Product Description must be at most 500 characters"],
    },

    quantity: {
      type: Number,
      required: [true, "Product Quantity is Required"],
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "Product Price is Required"],
      trim: true,
      min: 1,
      max: [1000000, "Product Price must be at most 1000000 $"],
    },

    priceAfterDiscount: {
      type: Number,
    },

    colors: [String],

    imageCover: {
      type: String,
      required: [true, "Product Image Cover is Required"],
    },

    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategories: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },

    averageRatings: {
      type: Number,
      min: [1, "Average Rating must be between 1 and 5"],
      max: [5, "Average Rating must be between 1 and 5"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "title",
  });

  next();
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }

  if (doc.images) {
    const imagesList = [];

    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });

    doc.images = imagesList;
  }
};

productSchema.post("init", (doc) => {
  setImageURL(doc);
});

productSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Product", productSchema);
