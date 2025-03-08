const { check } = require("express-validator");
const { validatorMiddleware } = require("../middlewares/validator.middleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID..."),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("title")
    .notEmpty()
    .withMessage("SubCategory title is required")
    .isLength({ min: 2 })
    .withMessage("Too short SubCategory title")
    .isLength({ max: 32 })
    .withMessage("Too long SubCategory title"),

  check("category")
    .notEmpty()
    .isMongoId()
    .withMessage("SubCategory Ivalid ID format..."),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID..."),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID..."),
  validatorMiddleware,
];
