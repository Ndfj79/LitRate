const mongoose = require('mongoose');

const coverSchema = new mongoose.Schema({
    url:{type: String},
}, { timestamps: true , collection: 'CoversLIB' });

const Cover = mongoose.model('Cover', coverSchema);

module.exports = Cover;