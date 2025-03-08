const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeatures = require("../api/api.features");
const { uploadSingleImage } = require("../middlewares/uploadImage.middleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Cover = require("../models/cover.model");

/**
 * @desc   Upload & Resize Cover Image
 * @access Private
 */
exports.uploadCoverImage = uploadSingleImage("image");
exports.resizeCoverImage = asyncHandler(async (req, res, next) => {
  const filename = `covers-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(1600, 312)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/covers/${filename}`);

    req.body.image = filename;
  }

  next();
});

/**
 * @desc   Get All Covers
 * @route  GET /api/v1/covers
 * @access Public
 */
exports.getCovers = asyncHandler(async (req, res) => {
  const documentCounts = await Cover.countDocuments();
  const apiFeatures = new ApiFeatures(Cover.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(documentCounts);

  const { mongooseQuery, paginationResult } = apiFeatures;
  const covers = await mongooseQuery;

  res.status(200).json({
    status: "success",
    results: covers.length,
    paginationResult,
    data: covers,
  });
});

/**
 * @desc   Get Signle Cover by ID
 * @route  GET /api/v1/covers/:id
 * @access Public
 */
exports.getCover = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cover = await Cover.findById(id);

  if (!cover) {
    return next(new ApiError(`No cover found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: cover });
});

/**
 * @desc   Create New Cover
 * @route  POST /api/v1/covers
 * @access Private
 */
exports.createCover = asyncHandler(async (req, res) => {
  const { title, image } = req.body;

  const cover = await Cover.create({ title, slug: slugify(title), image });
  res.status(201).json({ status: "success", data: cover });
});

/**
 * @desc   Update Specific Cover
 * @route  PUT /api/v1/covers/:id
 * @access Private
 */
exports.updateCover = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  const updatedCover = await Cover.findOneAndUpdate(
    { _id: id },
    { title, slug: slugify(title) },
    { new: true }
  );

  if (!updatedCover) {
    return next(new ApiError(`No Cover found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: updatedCover });
});

/**
 * @desc   Delete Specific Cover
 * @route  DELETE /api/v1/covers/:id
 * @access Private
 */
exports.DeleteCover = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedCover = await Cover.findOneAndDelete({ _id: id });

  if (!deletedCover) {
    return next(new ApiError(`No Cover found for this id ${id}`, 404));
  }

  res
    .status(200)
    .json({ status: "success", msg: "Cover Deleted Successfully..." });
});

/**
 * @desc   Delete All Covers
 * @route  DELETE /api/v1/covers
 * @access Private
 */
exports.DeleteCovers = asyncHandler(async (req, res, next) => {
  const covers = await Cover.find({});

  if (!covers) {
    return next(new ApiError("No covers found to delete", 404));
  }

  await Cover.deleteMany();

  res
    .status(200)
    .json({ status: "success", msg: "covers Deleted Successfully..." });
});
