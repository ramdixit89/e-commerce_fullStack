const mongoose = require('mongoose');
const Cart = require('./addToCart'); 
const Schema = mongoose.Schema;
const addProductSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    productDesc: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    }
});
addProductSchema.pre('findOneAndDelete', async function (next) {
    try {
        const product = await mongoose.model('products').findOne(this.getFilter()); 
        if (product) {
            console.log("Deleting related cart items for product:", product._id);
            await Cart.deleteMany({ product_Id: product._id }); 
        }
        next();
    } catch (err) {
        next(err);
    }
});
const addProduct = mongoose.model('products', addProductSchema);
module.exports = addProduct;
