const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    adReceived: {
        videoAd: {
            type: Boolean,
            required: true,
        },
        capsuleAd: {
            type: Boolean,
            required: true,
        },
        winkPlusAd: {
            type: Boolean,
            required: true,
        }
    }
});

module.exports = mongoose.model('counter', CounterSchema);
