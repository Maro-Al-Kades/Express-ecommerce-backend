const User = require("../models/user.model");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeatures = require("../api/api.features");
const { uploadSingleImage } = require("../middlewares/uploadImage.middleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

/**
 * @desc   Upload & Resize User Image
 * @access Public
 */
exports.uploadUserImage = uploadSingleImage("profileImg");
exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  const filename = `users-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    req.body.image = filename;
  }

  next();
});

/**
 * @desc   Get All Users
 * @route  GET /api/v1/users
 * @access Public
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  const documentCounts = await User.countDocuments();

  if (documentCounts === 0) {
    return res.status(200).json({ status: "success", results: 0, data: [] });
  }

  const apiFeatures = new ApiFeatures(
    User.find({}).select("+password").lean(),
    req.query
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(documentCounts);

  const { mongooseQuery, paginationResult } = apiFeatures;
  const users = await mongooseQuery.select("+password");

  res.status(200).json({
    status: "success",
    results: users.length,
    paginationResult,
    data: users,
  });
});

/**
 * @desc   Get Signle User by ID
 * @route  GET /api/v1/users/:id
 * @access Public
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).select("+password").lean();

  if (!user) {
    return next(new ApiError(`No user found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: user });
});

/**
 * @desc   Create New User
 * @route  POST /api/v1/users
 * @access Private
 */
exports.createUser = asyncHandler(async (req, res) => {
  console.log("Received Body:", req.body);
  const { name, email, profileImg, password, phone } = req.body;

  const user = await User.create({
    name,
    slug: slugify(name),
    profileImg,
    email,
    password,
    phone,
  });

  const newUser = await User.findById(user._id).select("+password");

  res.status(201).json({ status: "success", data: newUser });
});

/**
 * @desc   Update Specific User
 * @route  PUT /api/v1/users/:id
 * @access Private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      slug: name ? slugify(name) : undefined,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    { new: true }
  ).select("+password");

  if (!updatedUser) {
    return next(new ApiError(`No User found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: updatedUser });
});

/**
 * @desc   Change User Password
 * @route  DELETE /api/v1/users/:id/change-password
 * @access Public
 */
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    {
      password: await bcrypt.hash(req.body.password, 12),
    },
    { new: true }
  ).select("+password");

  if (!updatedUser) {
    return next(new ApiError(`No User found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: updatedUser });
});

/**
 * @desc   Delete Specific User
 * @route  DELETE /api/v1/users/:id
 * @access Private
 */
exports.DeleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedUser = await User.findOneAndDelete({ _id: id });

  if (!deletedUser) {
    return next(new ApiError(`No User found for this id ${id}`, 404));
  }

  res
    .status(200)
    .json({ status: "success", msg: "User Deleted Successfully..." });
});
