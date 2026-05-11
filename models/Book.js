const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    key:{type: String, required: true, unique: true},
    title:{type: String, required: true},
    authors:[{type: mongoose.Schema.Types.ObjectId, ref: 'Author'}],
    isbn:{type: String,sparse: true},
    year:{type: Number,sparse: true},
    genres:[{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
    cover:{type:String}
}, { timestamps: true , collection: 'booksLIB' });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;