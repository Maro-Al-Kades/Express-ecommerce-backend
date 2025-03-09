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

const router = express.Router();
router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
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
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, DeleteCategory);

module.exports = router;
