const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Key: {
        type: String,
        default: 'global',
        unique: true,
        immutable: true
    },
    Features: {
        type: mongoose.Schema.Types.Mixed,
        default: () => ({})
    },
    UpdatedBy: String
}, { timestamps: true });

module.exports = mongoose.model('globalFeatures', Schema);
