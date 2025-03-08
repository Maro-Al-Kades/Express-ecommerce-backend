const { check } = require("express-validator");
const { validatorMiddleware } = require("../middlewares/validator.middleware");
const { default: slugify } = require("slugify");
const User = require("../models/user.model");

/**
 * @desc   Validate Register Route
 * @route  GET /api/v1/auth/register
 * @access Public
 */
exports.RegisterValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("password confirmation failed");
      }

      return true;
    }),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Please enter your password again"),

  validatorMiddleware,
];

/**
 * @desc   Validate Login Route
 * @route  GET /api/v1/auth/login
 * @access Public
 */
exports.LoginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  check("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  validatorMiddleware,
];
