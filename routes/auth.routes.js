const express = require("express");
const { Register, Login, forgetPassword } = require("../actions/auth.actions");

const {
  RegisterValidator,
  LoginValidator,
} = require("../validations/auth.validator");

const router = express.Router();

router.post("/register", RegisterValidator, Register);
router.post("/login", LoginValidator, Login);
router.post("/forgetPassword", forgetPassword);

module.exports = router;
