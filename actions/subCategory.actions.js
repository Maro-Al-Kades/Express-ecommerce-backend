const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const SubCategory = require("../models/subCategory.model");
const ApiFeatures = require("../api/api.features");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

/**
 * @desc   Get Subcategories Count
 * @route  GET /api/v1/Subcategories
 * @access Public
 */
exports.getSubcategoriesCount = asyncHandler(async (req, res) => {
  const count = await SubCategory.countDocuments();

  res.status(200).json({
    status: "success",
    count,
  });
});

/**
 * @desc   Create New subCategory
 * @route  POST /api/v1/subcategories
 * @access Private
 */
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { title, category } = req.body;

  const subCategory = await SubCategory.create({
    title,
    slug: slugify(title),
    category,
  });

  res.status(201).json({ status: "success", data: subCategory });
});

/**
 * @desc   Create Filter Object
 * @access Private
 */
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };

  req.filterObj = filterObject;
  next();
};

/**
 * @desc   Get All Subcateogries
 * @route  GET /api/v1/subcategories
 * @access Public
 */
exports.getSubCategories = asyncHandler(async (req, res) => {
  const documentCounts = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(
    SubCategory.find().populate({ path: "category", select: ["title", "id"] }),
    req.query
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(documentCounts);

  const { mongooseQuery, paginationResult } = apiFeatures;

  const subCategories = await mongooseQuery;

  res.status(200).json({
    status: "success",
    results: subCategories.length,
    paginationResult,
    data: subCategories,
  });
});

/**
 * @desc   Get Signle subCategory by ID
 * @route  GET /api/v1/subcategories/:id
 * @access Public
 */
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id).populate({
    path: "category",
    select: ["title", "id"],
  });

  if (!subCategory) {
    return next(new ApiError(`No SubCategory found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: subCategory });
});

/**
 * @desc   Update Specific subCategory
 * @route  PUT /api/v1/subcategories/:id
 * @access Private
 */
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, category } = req.body;

  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { title, slug: slugify(title), category },
    { new: true }
  );

  if (!subCategory) {
    return next(new ApiError(`No subCategory found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: subCategory });
});

/**
 * @desc   Delete Specific subCategory
 * @route  DELETE /api/v1/subcategories/:id
 * @access Private
 */
exports.DeleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedSubCategory = await SubCategory.findOneAndDelete({ _id: id });

  if (!deletedSubCategory) {
    return next(new ApiError(`No subCategory found for this id ${id}`, 404));
  }

  res
    .status(200)
    .json({ status: "success", msg: "subCategory Deleted Successfully..." });
});

/**
 * @desc   Delete All Subcateogries
 * @route  DELETE /api/v1/subcategories
 * @access Private
 */
exports.DeleteSubCategories = asyncHandler(async (req, res, next) => {
  const subCategories = await SubCategory.find({});

  if (!subCategories) {
    return next(new ApiError("No subcategories found to delete", 404));
  }

  await SubCategory.deleteMany();

  res
    .status(200)
    .json({ status: "success", msg: "subCategories Deleted Successfully..." });
});
