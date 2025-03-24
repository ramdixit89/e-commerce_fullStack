const Product = require('../models/addProduct');
const cloudinary = require('../config/cloudinaryConfig');
// const fs = require('fs');
// const path = require('path');
// const uploadDir = path.join(__dirname, '../uploads/images');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }
//create
// const createProduct = async (req, res) => {
//     try {
//         const { productName, productDesc, productPrice } = req.body;
//         const image = req.files?.productImage;
//         if (!productName || !productDesc || !productPrice) {
//             return res.status(400).json({ message: "All fields are required" });
//         }
//         if (!image) {
//             return res.status(400).json({ message: "Product image is required" });
//         }
//         const imageName = `${Date.now()}-${image.name}`;
//         const imagePath = path.join(uploadDir, imageName);
//         await fs.promises.writeFile(imagePath, image.data);
//         const product = await Product.create({
//             productName,
//             productDesc,
//             productPrice,
//             productImage: imageName,
//         });
//         res.status(200).json({ status: "success", message: "Product created successfully", product });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: "failed", message: "Internal server error" });
//     }
// };

// Create Product
const createProduct = async (req, res) => {
    try {
        console.log("Received files:", req.files); // Debugging log
        const { productName, productDesc, productPrice } = req.body;
        const image = req.files?.productImage; // Assuming you're using express-fileupload
       

        if (!productName || !productDesc || !productPrice) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!image) {
            return res.status(400).json({ message: "Product image is required" });
        }

        // Upload Image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "products"
        });

        // Save product with Cloudinary image URL
        const product = await Product.create({
            productName,
            productDesc,
            productPrice,
            productImage: uploadResult.secure_url // Cloudinary image URL
        });

        res.status(200).json({ status: "success", message: "Product created successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Internal server error" });
    }
};
//Delete
const deleteProduct = async (req, res) => {
    try {
        const { product_Id } = req.params;
        const product = await Product.findByIdAndDelete(product_Id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
//Update product
// const updateProduct = async (req, res) => {
//     const { product_Id } = req.params;
//     const { productName, productDesc, productPrice } = req.body;
//     const image = req.files?.productImage;
//     try {
//         const product = await Product.findById(product_Id);
//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         if (image) {
//             const imageName = `${Date.now()}-${image.name}`;
//             const imagePath = path.join(uploadDir, imageName);
//             await fs.promises.writeFile(imagePath, image.data);
//             product.productImage = imageName;
//         }
//         product.productName = productName;
//         product.productDesc = productDesc;
//         product.productPrice = productPrice;
//         await product.save();
//         res.status(200).json({ message: "Product updated successfully", product });
//     } catch (error) {
//         console.log(error);
//     }
// }

//getf441

const updateProduct = async (req, res) => {
    const { product_Id } = req.params;
    const { productName, productDesc, productPrice } = req.body;
    const image = req.files?.productImage;

    try {
        const product = await Product.findById(product_Id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (image) {
            // Upload new image to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "products"
            });

            // Update product image URL
            product.productImage = uploadResult.secure_url;
        }

        product.productName = productName;
        product.productDesc = productDesc;
        product.productPrice = productPrice;
        await product.save();

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllProduct = async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.status(200).json(allProducts);
    } catch (error) {
        console.log('Error', error);
        res.status(400).json({ message: 'Internal server error!' });
    }
}
const getProductById = async(req, res) =>{
   try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({ status : 'success', product });
   } catch (error) {
    console.log('Error : ', error);
    res.status(400).json({ message : 'Internal server error!' });
   }
}
module.exports = { createProduct, getAllProduct, deleteProduct, updateProduct, getProductById };
