const { check } = require("express-validator");
const { validatorMiddleware } = require("../middlewares/validator.middleware");
const Category = require("../models/category.model");
const subCategory = require("../models/subCategory.model");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Product must be at least 3 characters")
    .notEmpty()
    .withMessage("Product Title must be at least 3 characters"),

  check("description")
    .notEmpty()
    .withMessage("Product Description must be at least 3 characters")
    .isLength({ max: 2000 })
    .withMessage("Product Description must be maximum 2000 characters"),

  check("quantity")
    .notEmpty()
    .withMessage("Product QUNATITY Required")
    .isNumeric()
    .withMessage("Product QUNATITY must be a Number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Productsold must be a Number"),

  check("price")
    .notEmpty()
    .withMessage("Product price is Required")
    .isNumeric()
    .withMessage("Product price must be a Number")
    .isLength({ max: 7 })
    .withMessage("Product price Too Long"),

  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage(
      "Product price After Discount is Required and must be a Number"
    )
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Price After Discount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Available colors should be an Array of strings"),

  check("imageCover").notEmpty().withMessage("Product Image Cover is Required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Product Images should be an Array of strings"),

  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No Category for this id: ${categoryId}`)
          );
        }
      })
    ),

  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((subcategoriesId) =>
      subCategory
        .find({ _id: { $exists: true, $in: subcategoriesId } })
        .then((result) => {
          if (result.length < 1 || result.length !== subcategoriesId.length) {
            return Promise.reject(new Error("Invalid Subcategories ids"));
          }
        })
    )
    .custom((value, { req }) =>
      subCategory
        .find({ category: req.body.category })
        .then((subcategories) => {
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });

          // check if subCategories ids in db include subCategories in req.body (true / false)
          const checker = (target, array) =>
            target.every((v) => array.includes(v));
          if (!checker(value, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error("Subcategories not belong to category")
            );
          }
        })
    ),

  check("brand").optional().isMongoId().withMessage("Invalid ID format"),

  check("averageRatings")
    .optional()
    .isNumeric()
    .withMessage("Average rating must be a number")
    .isLength({ min: 1 })
    .withMessage("Average rating must be a between 1 and 5")
    .isLength({ max: 5 })
    .withMessage("Average rating must be between 1 and 5"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Product ID must be correct"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Product ID must be correct"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Product ID must be correct"),
  validatorMiddleware,
];
