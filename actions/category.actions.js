const Category = require("../models/category.model");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeatures = require("../api/api.features");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImage.middleware");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  req.body.image = filename;

  next();
});

//* GET Categories
exports.getCategories = asyncHandler(async (req, res) => {
  const documentCounts = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(documentCounts);

  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;

  res.status(200).json({
    status: "success",
    results: categories.length,
    paginationResult,
    data: categories,
  });
});

//* GET Specific Category by id
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    return next(new ApiError(`No category found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: category });
});

//* POST Create New Category
exports.createCategory = asyncHandler(async (req, res) => {
  const { title, image } = req.body;

  const category = await Category.create({
    title,
    slug: slugify(title),
    image,
  });
  res.status(201).json({ status: "success", data: category });
});

//* PUT Update Specific Category by id
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  const updatedCategory = await Category.findOneAndUpdate(
    { _id: id },
    { title, slug: slugify(title) },
    { new: true }
  );

  if (!updatedCategory) {
    return next(new ApiError(`No category found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: updatedCategory });
});

//* DELETE Specific Category by id
exports.DeleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedCategory = await Category.findOneAndDelete({ _id: id });

  if (!deletedCategory) {
    return next(new ApiError(`No category found for this id ${id}`, 404));
  }

  res
    .status(200)
    .json({ status: "success", msg: "Category Deleted Successfully..." });
});
