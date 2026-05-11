const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    key:{type: String, required: true, unique: true},
    name:{type: String},
}, { timestamps: true , collection: 'authorsLIB' });

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;