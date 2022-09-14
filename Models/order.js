const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    orderNumber: {
        type: String,
        required: true,
    },
    callTime: {
        type: String,
        required: true,
    },
    onSite: {
        type: Boolean,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('order', OrderSchema);
