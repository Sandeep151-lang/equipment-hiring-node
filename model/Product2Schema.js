const mongoose = require('mongoose');


const product2Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: { type: String, required: true },
    product: { type: String, required: true },
    image: { type: String, required: true }

}, { timestamps: true });

module.exports = mongoose.model('category', product2Schema);