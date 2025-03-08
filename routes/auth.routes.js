const express = require("express");
const { Register, Login } = require("../actions/auth.actions");

const {
  RegisterValidator,
  LoginValidator,
} = require("../validations/auth.validator");

const router = express.Router();

router.route("/register").post(RegisterValidator, Register);
router.route("/login").post(LoginValidator, Login);

// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, DeleteUser);

module.exports = router;
