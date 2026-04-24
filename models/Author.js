const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    key:{type: String, required: true},
    name:{type: String},
    birth_date:{type: String,sparse: true}, 
    death_date:{type: String,sparse: true},
}, { timestamps: true });

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;