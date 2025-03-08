const { check, body } = require("express-validator");
const { validatorMiddleware } = require("../middlewares/validator.middleware");
const { default: slugify } = require("slugify");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

exports.createUserValidator = [
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

  check("profileImg").optional(),

  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "uk-UA", "en-US"])
    .withMessage("Invalid phone number"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID..."),
  check("name")
    .optional()
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

  check("profileImg").optional(),

  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "uk-UA", "en-US"])
    .withMessage("Invalid phone number"),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User ID..."),

  body("currentPassword").notEmpty().withMessage("Invalid current password"),
  body("confirmPassword").notEmpty().withMessage("Invalid confirm password"),
  body("password")
    .notEmpty()
    .withMessage("You must provide a valid password")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id).select("+password"); // ✅ اجلب كلمة السر المخفية

      if (!user) {
        throw new Error("No User found");
      }

      const isPasswordMatch = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isPasswordMatch) {
        throw new Error("Incorrect current password");
      }

      if (val !== req.body.confirmPassword) {
        throw new Error("Password Confirmation incorrect");
      }

      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID..."),
  validatorMiddleware,
];
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID..."),
  validatorMiddleware,
];
