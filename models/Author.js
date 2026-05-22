const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name:{type: String},
}, { timestamps: true , collection: 'authorsLIB' });

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;