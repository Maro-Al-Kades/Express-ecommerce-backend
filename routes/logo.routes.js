const express = require("express");

const {
  uploadLogoImage,
  resizeLogoImage,
  createLogo,
  getLogo,
  updateLogo,
  DeleteLogo,
} = require("../actions/logo.actions");
const {
  createLogoValidator,
  updateLogoValidator,
  deleteLogoValidator,
} = require("../validations/logo.validator");

const router = express.Router();

router
  .route("/")
  .get(getLogo)
  .post(uploadLogoImage, resizeLogoImage, createLogoValidator, createLogo);
router
  .route("/:id")
  .put(uploadLogoImage, resizeLogoImage, updateLogoValidator, updateLogo)
  .delete(deleteLogoValidator, DeleteLogo);

module.exports = router;
