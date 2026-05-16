const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    isbn:{type: String,sparse: true},
    author_ids:[{type: mongoose.Schema.Types.ObjectId, ref: 'Author'}],
    cover_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Cover'},
    genre_ids:[{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
    title:{type: String, required: true},
    year:{type: Number,sparse: true},
    rate_count:{type: Number, sparse: true}
}, { timestamps: true , collection: 'booksLIB' });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;