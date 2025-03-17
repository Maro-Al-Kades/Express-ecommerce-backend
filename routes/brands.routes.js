const express = require("express");
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  DeleteBrand,
  uploadBrandImage,
  resizeBrandImage,
  getBrandsCount,
  DeleteBrands,
} = require("../actions/brand.actions");
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../validations/brand.validator");
const AuthService = require("../actions/auth.actions");

const router = express.Router();

router.route("/count").get(getBrandsCount);

router
  .route("/")
  .get(getBrands)
  .post(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    uploadBrandImage,
    resizeBrandImage,
    createBrandValidator,
    createBrand
  )
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    DeleteBrands
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    uploadBrandImage,
    resizeBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    deleteBrandValidator,
    DeleteBrand
  );

module.exports = router;
