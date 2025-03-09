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

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObject, getSubCategories)
  .delete(DeleteSubCategories);

router.get("/count", getSubcategoriesCount);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, DeleteSubCategory);

module.exports = router;
