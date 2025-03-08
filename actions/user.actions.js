const User = require("../models/user.model");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeatures = require("../api/api.features");
const { uploadSingleImage } = require("../middlewares/uploadImage.middleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

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

//* GET Users
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

//* GET Specific Brand by id
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).select("+password").lean();

  if (!user) {
    return next(new ApiError(`No user found for this id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: user });
});

//* POST Create New user
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

//* PUT Update Specific User by id
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

//* PUT Update User Password
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

//* DELETE Specific User by id
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
