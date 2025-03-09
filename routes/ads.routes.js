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

const router = express.Router();

router
  .route("/")
  .get(getAds)
  .post(uploadAdImage, resizeAdImage, createAdValidator, createAd)
  .delete(DeleteAds);

router.get("/count", getAdsCount);
router
  .route("/:id")
  .get(getAdValidator, getAd)
  .put(uploadAdImage, resizeAdImage, updateAdValidator, updateAd)
  .delete(deleteAdValidator, DeleteAd);

module.exports = router;
