const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeatures = require("../api/api.features");
const { uploadSingleImage } = require("../middlewares/uploadImage.middleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const AD = require("../models/Ad.model");

exports.uploadAdImage = uploadSingleImage("image");

exports.resizeAdImage = asyncHandler(async (req, res, next) => {
  const filename = `ads-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(1000, 1000)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/ads/${filename}`);

    req.body.image = filename;
  }

  next();
});

//* GET Ads
exports.getAds = asyncHandler(async (req, res) => {
  const documentCounts = await AD.countDocuments();
  const apiFeatures = new ApiFeatures(AD.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(documentCounts);

  const { mongooseQuery, paginationResult } = apiFeatures;
  const ads = await mongooseQuery;

  res.status(200).json({
    status: "success",
    results: ads.length,
    paginationResult,
    data: ads,
  });
});

//* GET Specific Ad by id
exports.getAd = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const ad = await AD.findById(id);

  if (!ad) {
    return next(new ApiError(`No ad found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: ad });
});

//* POST Create New ad
exports.createAd = asyncHandler(async (req, res) => {
  const { title, image } = req.body;

  const ad = await AD.create({ title, slug: slugify(title), image });
  res.status(201).json({ status: "success", data: ad });
});

//* PUT Update Specific AD by id
exports.updateAd = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  const updatedAd = await AD.findOneAndUpdate(
    { _id: id },
    { title, slug: slugify(title) },
    { new: true }
  );

  if (!updatedAd) {
    return next(new ApiError(`No AD found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: updatedAd });
});

//* DELETE Specific AD by id
exports.DeleteAd = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedAd = await AD.findOneAndDelete({ _id: id });

  if (!deletedAd) {
    return next(new ApiError(`No AD found for this id ${id}`, 404));
  }

  res
    .status(200)
    .json({ status: "success", msg: "AD Deleted Successfully..." });
});

exports.DeleteAds = asyncHandler(async (req, res, next) => {
  const ads = await AD.find({});

  if (!ads) {
    return next(new ApiError("No ads found to delete", 404));
  }

  await AD.deleteMany();

  res
    .status(200)
    .json({ status: "success", msg: "ads Deleted Successfully..." });
});
