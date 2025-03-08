const express = require("express");
const { Register } = require("../actions/auth.actions");

const { RegisterValidator } = require("../validations/auth.validator");

const router = express.Router();

router.route("/register").post(RegisterValidator, Register);
// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, DeleteUser);

module.exports = router;
