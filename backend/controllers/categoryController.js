const Category = require('../models/categoryModel');

const createCategory = async (req, res) => {
    try {
        const { name, description, globalVariantInfo } = req.body;
        const category = await Category.create({ name, description, globalVariantInfo });
        res.status(201).json({ status: "success", category });
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCategory, getAllCategories, deleteCategory };
