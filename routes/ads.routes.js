const express = require("express");

const {
  createAdValidator,
  getAdValidator,
  updateAdValidator,
  deleteAdValidator,
} = require("../validations/ad.validator");
const {
  getAds,
  createAd,
  uploadAdImage,
  resizeAdImage,
  DeleteAds,
  getAdsCount,
  getAd,
  updateAd,
  DeleteAd,
} = require("../actions/ad.actions");
const AuthService = require("../actions/auth.actions");

const router = express.Router();

router
  .route("/")
  .get(getAds)
  .post(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    uploadAdImage,
    resizeAdImage,
    createAdValidator,
    createAd
  )
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    DeleteAds
  );

router.get("/count", getAdsCount);
router
  .route("/:id")
  .get(getAdValidator, getAd)
  .put(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    uploadAdImage,
    resizeAdImage,
    updateAdValidator,
    updateAd
  )
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    deleteAdValidator,
    DeleteAd
  );

module.exports = router;
