const mongoose = require('mongoose');

const botStatusSchema = new mongoose.Schema({
    Key: { type: String, default: 'global', unique: true },
    Activity: { type: String, required: true, maxlength: 128 },
    Type: { type: String, enum: ['Playing', 'Listening', 'Watching', 'Streaming', 'Competing'], default: 'Playing' },
    Presence: { type: String, enum: ['online', 'idle', 'dnd', 'invisible'], default: 'online' },
    UpdatedBy: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('BotStatus', botStatusSchema);
