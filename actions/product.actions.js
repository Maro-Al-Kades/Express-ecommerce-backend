const Product = require("../models/product.model");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeatures = require("../api/api.features");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const {
  uploadMultipleImages,
} = require("../middlewares/uploadImage.middleware");

exports.uploadProductImages = uploadMultipleImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `products-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 2000)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `products-${uuidv4()}-${Date.now()}-${index}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      })
    );
  }
  next();
});

//~ GET List of Products (PUBLIC)
exports.getProducts = asyncHandler(async (req, res) => {
  const documentCounts = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(
    Product.find().populate("category", ""),
    req.query
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(documentCounts);

  const { mongooseQuery, paginationResult } = apiFeatures;
  const products = await mongooseQuery;

  res.status(200).json({
    status: "success",
    results: products.length,
    paginationResult,
    data: products,
  });
});

//~ GET Specific Product by ID (PUBLIC)
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "title",
  });

  if (!product) {
    return next(new ApiError(`No product found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: product });
});

//~ POST Create New Product (PRIVATE)
exports.createProduct = asyncHandler(async (req, res, next) => {
  try {
    if (!req.body.title) {
      return next(new ApiError("Product title is required", 400));
    }

    req.body.slug = slugify(req.body.title, { lower: true });

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

//~ PUT  Update Specific Product by ID (PRIVATE)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.title);

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!product) {
    return next(new ApiError(`No Product found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: product });
});

//~ DELETE  Delete Specific Product by ID (PRIVATE)
exports.DeleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedProduct = await Product.findOneAndDelete({ _id: id });

  if (!deletedProduct) {
    return next(new ApiError(`No Product found for this id ${id}`, 404));
  }

  res
    .status(204)
    .json({ status: "success", msg: "Product Deleted Successfully..." });
});
