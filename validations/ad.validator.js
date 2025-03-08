const { check } = require("express-validator");
const { validatorMiddleware } = require("../middlewares/validator.middleware");
const { default: slugify } = require("slugify");

exports.getAdValidator = [
  check("id").isMongoId().withMessage("Invalid Ad ID..."),
  validatorMiddleware,
];

exports.createAdValidator = [
  check("title")
    .notEmpty()
    .withMessage("Ad title is required")
    .isLength({ min: 3 })
    .withMessage("Too short Ad title"),

  validatorMiddleware,
];

exports.updateAdValidator = [
  check("id").isMongoId().withMessage("Invalid Ad ID..."),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteAdValidator = [
  check("id").isMongoId().withMessage("Invalid Ad ID..."),
  validatorMiddleware,
];
