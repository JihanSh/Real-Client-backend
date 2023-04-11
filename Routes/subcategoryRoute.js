import express from "express";
const router = express.Router();

import {
    getAllsubCategories,
    getSubCategoryById,
    createSubCategory,
    editSubCategory,
    deleteSubCategory
  } from "../Controllers/subcategoryController.js";

router.get('/', getAllsubCategories);
router.get('/:id', getSubCategoryById);
router.post('/', createSubCategory);
router.put('/:id', editSubCategory);
router.delete('/:id', deleteSubCategory);



export default router;