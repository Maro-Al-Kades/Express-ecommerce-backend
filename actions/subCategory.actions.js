const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const SubCategory = require("../models/subCategory.model");
const ApiFeatures = require("../api/api.features");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//* POST Create New SubCategory - ${DOMAIN}/api/v1/subCategories
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { title, category } = req.body;

  const subCategory = await SubCategory.create({
    title,
    slug: slugify(title),
    category,
  });

  res.status(201).json({ status: "success", data: subCategory });
});

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };

  req.filterObj = filterObject;
  next();
};

//* GET SubCategories - ${DOMAIN}/api/v1/subCategories
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

//* GET Specific SubCategory by id - ${DOMAIN}/api/v1/subCategories/:id
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

//* PUT Update Specific SubCategory by id - ${DOMAIN}/api/v1/subCategories/:id
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

//* DELETE Specific SubCategory by id - ${DOMAIN}/api/v1/subCategories/:id
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

//* DELETE All SubCategories - ${DOMAIN}/api/v1/subCategories
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
