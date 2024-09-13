const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortURL: {
        type: String,
        required: true,
        unique: true,
    },
    redirectedURL: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('URL', urlSchema);
