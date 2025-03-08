const { check } = require("express-validator");
const { validatorMiddleware } = require("../middlewares/validator.middleware");
const { default: slugify } = require("slugify");

exports.getCoverValidator = [
  check("id").isMongoId().withMessage("Invalid Cover ID..."),
  validatorMiddleware,
];

exports.createCoverValidator = [
  check("title")
    .notEmpty()
    .withMessage("Cover title is required")
    .isLength({ min: 3 })
    .withMessage("Too short Cover title"),

  validatorMiddleware,
];

exports.updateCoverValidator = [
  check("id").isMongoId().withMessage("Invalid Cover ID..."),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCoverValidator = [
  check("id").isMongoId().withMessage("Invalid Cover ID..."),
  validatorMiddleware,
];
