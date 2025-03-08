const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  changeUserPassword,
  DeleteUser,
  uploadUserImage,
  resizeUserImage,
} = require("../actions/user.actions");

const {
  createUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
} = require("../validations/user.validator");

const router = express.Router();

router.put(
  "/change-password/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, DeleteUser);

module.exports = router;
