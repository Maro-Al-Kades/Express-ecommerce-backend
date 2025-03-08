const express = require("express");
const {
  getCovers,
  createCover,
  getCover,
  updateCover,
  DeleteCover,
  DeleteCovers,
  uploadCoverImage,
  resizeCoverImage,
} = require("../actions/cover.actions");
const {
  createCoverValidator,
  getCoverValidator,
  updateCoverValidator,
  deleteCoverValidator,
} = require("../validations/cover.validator");

const router = express.Router();

router
  .route("/")
  .get(getCovers)
  .post(uploadCoverImage, resizeCoverImage, createCoverValidator, createCover)
  .delete(DeleteCovers);
router
  .route("/:id")
  .get(getCoverValidator, getCover)
  .put(uploadCoverImage, resizeCoverImage, updateCoverValidator, updateCover)
  .delete(deleteCoverValidator, DeleteCover);

module.exports = router;
