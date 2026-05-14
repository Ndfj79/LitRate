const mongoose = require('mongoose');

const coverSchema = new mongoose.Schema({
    _id:{type: String, required: true, unique: true},
    url:{type: String},
}, { timestamps: true , collection: 'CoversLIB' });

const Cover = mongoose.model('Cover', authorSchema);

module.exports = Cover;