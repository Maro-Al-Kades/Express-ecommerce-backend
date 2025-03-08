const { check } = require("express-validator");
const { validatorMiddleware } = require("../middlewares/validator.middleware");
const { default: slugify } = require("slugify");

exports.getLogoValidator = [
  check("id").isMongoId().withMessage("Invalid Logo ID..."),
  validatorMiddleware,
];

exports.createLogoValidator = [
  check("title")
    .notEmpty()
    .withMessage("Logo title is required")
    .isLength({ min: 3 })
    .withMessage("Too short Logo title"),

  validatorMiddleware,
];

exports.updateLogoValidator = [
  check("id").isMongoId().withMessage("Invalid Logo ID..."),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteLogoValidator = [
  check("id").isMongoId().withMessage("Invalid Logo ID..."),
  validatorMiddleware,
];
