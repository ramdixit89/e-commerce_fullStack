const express = require('express');
const { createCategory, getAllCategories, deleteCategory } = require('../controllers/categoryController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', createCategory);
router.get('/all', getAllCategories);
router.delete('/:id', deleteCategory);

module.exports = router;
