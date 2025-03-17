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
  getUsersCount,
} = require("../actions/user.actions");

const {
  createUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
} = require("../validations/user.validator");
const AuthService = require("../actions/auth.actions");

const router = express.Router();

router.put(
  "/change-password/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    getUsers
  )
  .post(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    createUserValidator,
    createUser
  );

router.get("/count", getUsersCount);

router
  .route("/:id")
  .get(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    getUserValidator,
    getUser
  )
  .put(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    deleteUserValidator,
    DeleteUser
  );

module.exports = router;
