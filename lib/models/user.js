const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
    name: String,
    token: String,
    admin: Boolean,
    id: String,
    discord: Object,
    auth: Object,
    lastUpdated: Number,
    timezone: String
}));
