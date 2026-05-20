const mongoose = require('mongoose');

const BooksShelfSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    shelf_books: [[{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}]],
    shelfname:[{type: String}]
}, { timestamps: true , collection: 'BooksShelf' });

const BooksShelf = mongoose.model('BooksShelf', BooksShelfSchema);

module.exports = BooksShelf;