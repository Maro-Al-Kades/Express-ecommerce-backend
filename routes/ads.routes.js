const express = require("express");

const {
  getAds,
  DeleteAds,
  uploadAdImage,
  resizeAdImage,
  createAd,
  getAd,
  updateAd,
  DeleteAd,
} = require("../actions/Ad.actions");
const {
  createAdValidator,
  getAdValidator,
  updateAdValidator,
  deleteAdValidator,
} = require("../validations/ad.validator");

const router = express.Router();

router
  .route("/")
  .get(getAds)
  .post(uploadAdImage, resizeAdImage, createAdValidator, createAd)
  .delete(DeleteAds);
router
  .route("/:id")
  .get(getAdValidator, getAd)
  .put(uploadAdImage, resizeAdImage, updateAdValidator, updateAd)
  .delete(deleteAdValidator, DeleteAd);

module.exports = router;
