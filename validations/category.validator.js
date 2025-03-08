const { check } = require("express-validator");
const { validatorMiddleware } = require("../middlewares/validator.middleware");
const { default: slugify } = require("slugify");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID..."),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("title")
    .notEmpty()
    .withMessage("Category title is required")
    .isLength({ min: 3 })
    .withMessage("Too short category title")
    .isLength({ max: 32 })
    .withMessage("Too long category title"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID..."),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID..."),
  validatorMiddleware,
];
