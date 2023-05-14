const mongoose = require('mongoose')


const paymentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String

    },
    email: {
        type: String

    },
    paymentID: {
        type: String

    },
    shippingAddress: {
        type: Object
    },
    cartItems: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered'],
        default: 'Pending',
        required: true
    },
    total: {
        type: Number
    },
    starttime: {
        type: String
    },
    endtime: {
        type: String
    },
    Totalhr: {
        type: Number
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('payment', paymentSchema);