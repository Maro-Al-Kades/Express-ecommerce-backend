const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const ApiError = require("../errors/apiError");
const User = require("../models/user.model.js");
const generateToken = require("../utils/generateJWT.js");
const sendEmail = require("../utils/sendEmail.js");

/**
 * @desc   Register
 * @route  GET /api/v1/auth/register
 * @access Public
 */
exports.Register = asyncHandler(async (req, res, next) => {
  // 1.create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 1.generate JWT
  const token = generateToken(user._id);

  res.status(201).json({ data: user, token });
});

/**
 * @desc   Login
 * @route  GET /api/v1/auth/login
 * @access Public
 */
exports.Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.password) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

/**
 * @desc   Protect Routes Middleware
 * @access Private
 */
exports.PROTECT_MIDDLEWARE = asyncHandler(async (req, res, next) => {
  // 1. check if token exist
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "Invalid token, Please Login or Register to get access this route",
        401
      )
    );
  }

  // 2. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3. check if token is valid
  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new ApiError(
        "the user that belong to this token does no longer exist",
        401
      )
    );
  }

  // 4. check if user is authorized
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password, please login again...",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

/**
 * @desc   Authorizations (Permissions)
 * @access Private [admin, manager]
 */
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("your are not allowed to access this route", 403)
      );
    }
    next();
  });

/**
 * @desc  Forget Password
 * @route  POST /api/v1/auth/forgetPassword
 * @access Public
 */
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // Get User by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }

  // Check if user exist & encrypt reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // save hashed reset code into db
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // sent rest code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure. \n Maro-Shop Team`;

  await sendEmail({
    email: user.email,
    subject: "Your Password Reset Code (Valid for 10 min)",
    message,
  });

  res.status(200).json({
    status: "success",
    message: "Reset Code sent to email successfully",
  });
});
