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

const router = express.Router();

router.route("/count").get(getBrandsCount);

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, resizeBrandImage, createBrandValidator, createBrand)
  .delete(DeleteBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(uploadBrandImage, resizeBrandImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, DeleteBrand);

module.exports = router;
