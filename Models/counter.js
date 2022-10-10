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
    // adReceived: {
    //     type: Boolean,
    //     required: true,
    // }
});

module.exports = mongoose.model('counter', CounterSchema);
