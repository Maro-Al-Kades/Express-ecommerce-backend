const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeatures = require("../api/api.features");
const { uploadSingleImage } = require("../middlewares/uploadImage.middleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Logo = require("../models/Logo.model");

exports.uploadLogoImage = uploadSingleImage("image");

exports.resizeLogoImage = asyncHandler(async (req, res, next) => {
  const filename = `logos-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(1000, 1000)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/logos/${filename}`);

    req.body.image = filename;
  }

  next();
});

//* GET Logo
exports.getLogo = asyncHandler(async (req, res) => {
  const documentCounts = await Logo.countDocuments();
  const apiFeatures = new ApiFeatures(Logo.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(documentCounts);

  const { mongooseQuery, paginationResult } = apiFeatures;
  const logo = await mongooseQuery;

  res.status(200).json({
    status: "success",
    results: logo.length,
    paginationResult,
    data: logo,
  });
});

//* POST Create New Logo
exports.createLogo = asyncHandler(async (req, res) => {
  const { title, image } = req.body;

  const logo = await Logo.create({ title, slug: slugify(title), image });
  res.status(201).json({ status: "success", data: logo });
});

//* PUT Update Specific Logo by id
exports.updateLogo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  const updatedLogo = await Logo.findOneAndUpdate(
    { _id: id },
    { title, slug: slugify(title) },
    { new: true }
  );

  if (!updatedLogo) {
    return next(new ApiError(`No Logo found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: updatedLogo });
});

//* DELETE Specific Logo by id
exports.DeleteLogo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedLogo = await Logo.findOneAndDelete({ _id: id });

  if (!deletedLogo) {
    return next(new ApiError(`No Logo found for this id ${id}`, 404));
  }

  res
    .status(200)
    .json({ status: "success", msg: "Logo Deleted Successfully..." });
});
