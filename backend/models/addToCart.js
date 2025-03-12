const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addToCartSchema = new Schema({
    user_Id:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    product_Id:{
        type: Schema.Types.ObjectId,
        ref:'products',
        required:true
    },
    quantity:{
        type:Number,
        min:1,
        required:true
    }
});
const addToCart = mongoose.model('cart',addToCartSchema);
module.exports = addToCart;