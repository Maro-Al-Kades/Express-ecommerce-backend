const express = require("express");
const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  DeleteSubCategory,
  DeleteSubCategories,
  setCategoryIdToBody,
  createFilterObject,
  getSubcategoriesCount,
} = require("../actions/subCategory.actions");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../validations/subCategory.validator");
const {
  updateCategoryValidator,
} = require("../validations/category.validator");

const AuthService = require("../actions/auth.actions");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getSubCategories)
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    DeleteSubCategories
  );

router.get("/count", getSubcategoriesCount);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("manager", "admin"),
    updateCategoryValidator,
    updateSubCategory
  )
  .delete(
    AuthService.PROTECT_MIDDLEWARE,
    AuthService.allowedTo("admin"),
    deleteSubCategoryValidator,
    DeleteSubCategory
  );

module.exports = router;
