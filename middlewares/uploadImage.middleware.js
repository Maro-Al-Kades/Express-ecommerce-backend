const multer = require("multer");
const ApiError = require("../errors/apiError");

const multerOptions = () => {
  const STORAGE = multer.memoryStorage();

  const FILE_FILTER = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(
        new ApiError("Invalid file type. Only images are allowed", 400),
        false
      );
    }
  };

  const upload = multer({ storage: STORAGE, fileFilter: FILE_FILTER });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMultipleImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
