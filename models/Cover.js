const mongoose = require('mongoose');

const coverSchema = new mongoose.Schema({
    key:{type: String, required: true, unique: true},
    name:{type: String},
}, { timestamps: true , collection: 'CoversLIB' });

const Cover = mongoose.model('Cover', authorSchema);

module.exports = Cover;