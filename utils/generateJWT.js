const jwt = require("jsonwebtoken");

/**
 * @desc   Generate JWT Token
 */
const generateToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

module.exports = generateToken;
