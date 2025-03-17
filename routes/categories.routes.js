const express = require("express");

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  DeleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
  getCateogriesCount,
} = require("../actions/category.actions");
const {
  getCategoryValidator,
  updateCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
} = require("../validations/category.validator");
const subCategoriesRoute = require("./subCategory.routes");

const AuthService = require("../actions/auth.actions");

const router = express.Router();
router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  );

router.route("/count").get(getCateogriesCount);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    deleteCategoryValidator,
    DeleteCategory
  );

module.exports = router;
