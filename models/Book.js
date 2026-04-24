const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    key:{type: String, required: true},
    title:{type: String, required: true},
    authors:[{type: String}],
    physical_format:{type: String,sparse: true},
    isbn_10:{type: String,sparse: true},
    isbn_13:{type: String,sparse: true},
    publish_date:{type: String,sparse: true},
    subjects:[{type: String}],
    number_of_pages:{type:Number,sparse: true},
    cover:{type:number}
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;