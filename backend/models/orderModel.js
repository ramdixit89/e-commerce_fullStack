const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user_Id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true 
    },
    order_date: { 
        type: Date, 
        default: Date.now 
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Canceled"],
        default: "Pending"
    },
    customer_details: {
        name: { 
            type: String, 
            required: true
        },
        email: { 
            type: String, 
            required: true
        },
        phone: { 
            type: String, 
            required: true
        }
    },
    billing_address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    shipping_address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    payment: {
        method: { 
            type: String, 
            enum: ["Credit Card", "PayPal", "COD"], 
            required: true
        },
        status: { 
            type: String, 
            enum: ["Paid", "Unpaid", "Refunded"], 
            default: "Unpaid" 
        }
    },
    products: [
        {
            product_id: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product", 
                required: true 
            },
            name: { 
                type: String, 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true
            },
            total_amount:{
                type: Number,
                required: true
            }
        }
    ]
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
