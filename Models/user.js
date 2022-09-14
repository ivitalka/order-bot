const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('user', UserSchema);
