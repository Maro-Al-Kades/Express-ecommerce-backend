const express = require("express");

const {
  getProducts,
  getProductsCount,
} = require("../actions/product.actions.js");
const { createProduct } = require("../actions/product.actions.js");
const { getProduct } = require("../actions/product.actions.js");
const { updateProduct } = require("../actions/product.actions.js");
const { DeleteProduct } = require("../actions/product.actions.js");
const { uploadProductImages } = require("../actions/product.actions.js");
const { resizeProductImages } = require("../actions/product.actions.js");

const {
  getProductValidator,
  updateProductValidator,
  createProductValidator,
  deleteProductValidator,
} = require("../validations/product.validator.js");
const AuthService = require("../actions/auth.actions");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router.get("/count", getProductsCount);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    deleteProductValidator,
    DeleteProduct
  );

module.exports = router;
