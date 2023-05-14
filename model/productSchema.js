const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    product_name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    description1: { type: String, required: true },
    list1: {
        type: String, required: true
    },
    list2: { type: String, required: true },
    list3: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('product', productSchema);