const Brand = require("../models/brand.model");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeatures = require("../api/api.features");
const { uploadSingleImage } = require("../middlewares/uploadImage.middleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

/**
 * @desc   Upload & Resize Brand Image
 * @access Private
 */
exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  const filename = `brands-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;

  next();
});

/**
 * @desc   Get All Brands
 * @route  GET /api/v1/brands
 * @access Public
 */
exports.getBrands = asyncHandler(async (req, res) => {
  const documentCounts = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(
    Brand.find().populate("category", "title"),
    req.query
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(documentCounts);

  const { mongooseQuery, paginationResult } = apiFeatures;
  const brands = await mongooseQuery;

  res.status(200).json({
    status: "success",
    results: brands.length,
    paginationResult,
    data: brands,
  });
});

/**
 * @desc   Get Signle Brand by ID
 * @route  GET /api/v1/brands/:id
 * @access Public
 */
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    return next(new ApiError(`No Brand found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: brand });
});

/**
 * @desc   Create New Brand
 * @route  POST /api/v1/brands
 * @access Private
 */
exports.createBrand = asyncHandler(async (req, res) => {
  const { title, image } = req.body;

  const brand = await Brand.create({ title, slug: slugify(title), image });
  res.status(201).json({ status: "success", data: brand });
});

/**
 * @desc   Update Specific Brand
 * @route  PUT /api/v1/brands/:id
 * @access Private
 */
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  const updatedBrand = await Brand.findOneAndUpdate(
    { _id: id },
    { title, slug: slugify(title) },
    { new: true }
  );

  if (!updatedBrand) {
    return next(new ApiError(`No Brand found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: updatedBrand });
});

/**
 * @desc   Delete Specific Brand
 * @route  DELETE /api/v1/brands/:id
 * @access Private
 */
exports.DeleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedBrand = await Brand.findOneAndDelete({ _id: id });

  if (!deletedBrand) {
    return next(new ApiError(`No Brand found for this id ${id}`, 404));
  }

  res
    .status(200)
    .json({ status: "success", msg: "Brand Deleted Successfully..." });
});
