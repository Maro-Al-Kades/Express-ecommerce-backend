const ApiError = require("../errors/apiError");

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again.", 401);

const handleJwtExpired = () =>
  new ApiError("Expired token, please login again.", 401);

/**
  @desc Global Error Handler 
*/
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") {
      err = handleJwtInvalidSignature();
    }
    if (err.name === "TokenExpiredError") {
      err = handleJwtExpired();
    }
    sendErrorForProd(err, res);
  }
};

/**
  @desc Development Mode Error Handler 
*/
const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
  @desc Production Mode Error Handler 
*/
const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
