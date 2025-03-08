const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../models/product.model");

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = Array.from({ length: 20 }, (_, i) => ({
  title: `Product ${i + 1}`,
  slug: `product-${i + 1}`,
  description: `This is a detailed description of Product ${i + 1}. It contains all the necessary details.`,
  quantity: Math.floor(Math.random() * 100) + 1,
  price: Math.floor(Math.random() * 500) + 10,
  priceAfterDiscount: Math.floor(Math.random() * 400) + 5,
  colors: ["red", "blue", "green"],
  imageCover: `product-${i + 1}-cover.jpg`,
  images: ["image1.jpg", "image2.jpg", "image3.jpg"],
  category: new mongoose.Types.ObjectId(), // استبدل بمعرف صحيح من قاعدة البيانات
  subcategories: new mongoose.Types.ObjectId(),
  brand: new mongoose.Types.ObjectId(),
  averageRatings: (Math.random() * 4 + 1).toFixed(1),
  ratingsQuantity: Math.floor(Math.random() * 200),
}));

Product.insertMany(products)
  .then(() => {
    console.log("Products added successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error adding products:", err);
    mongoose.connection.close();
  });
