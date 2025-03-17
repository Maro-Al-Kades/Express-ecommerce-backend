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
  getCoversCount,
} = require("../actions/cover.actions");
const {
  createCoverValidator,
  getCoverValidator,
  updateCoverValidator,
  deleteCoverValidator,
} = require("../validations/cover.validator");
const AuthService = require("../actions/auth.actions");

const router = express.Router();

router
  .route("/")
  .get(getCovers)
  .post(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    uploadCoverImage,
    resizeCoverImage,
    createCoverValidator,
    createCover
  )
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    DeleteCovers
  );

router.route("/count").get(getCoversCount);
router
  .route("/:id")
  .get(getCoverValidator, getCover)
  .put(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    uploadCoverImage,
    resizeCoverImage,
    updateCoverValidator,
    updateCover
  )
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    deleteCoverValidator,
    DeleteCover
  );

module.exports = router;
