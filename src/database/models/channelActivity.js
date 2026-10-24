const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: String,
    Category: String,
    Mode: {
        type: String,
        enum: ['automatic', 'manual', 'hybrid'],
        default: 'automatic'
    },
    PinnedOrder: {
        type: String,
        enum: ['first', 'last'],
        default: 'first'
    },
    IsActive: { type: Boolean, default: true },
    LastCheck: { type: Date, default: Date.now }
});

module.exports = mongoose.model("channelActivity", Schema);
