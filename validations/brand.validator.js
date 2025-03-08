const { check } = require("express-validator");
const { validatorMiddleware } = require("../middlewares/validator.middleware");
const { default: slugify } = require("slugify");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID..."),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("title")
    .notEmpty()
    .withMessage("Brand title is required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand title")
    .isLength({ max: 32 })
    .withMessage("Too long Brand title"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID..."),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID..."),
  validatorMiddleware,
];
