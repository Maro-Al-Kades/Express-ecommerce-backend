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
const AuthService = require("../actions/auth.actions");

const router = express.Router();

router
  .route("/")
  .get(getLogo)
  .post(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    uploadLogoImage,
    resizeLogoImage,
    createLogoValidator,
    createLogo
  );
router
  .route("/:id")
  .put(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    uploadLogoImage,
    resizeLogoImage,
    updateLogoValidator,
    updateLogo
  )
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    deleteLogoValidator,
    DeleteLogo
  );

module.exports = router;
