const mongoose = require('mongoose');

const BooksShelfSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    us_books: [[{type: mongoose.Schema.Types.ObjectId, ref: 'BooksShelf'}]],
    Shelfname:[{type: String}]
}, { timestamps: true , collection: 'BooksShelf' });

const BooksShelf = mongoose.model('BooksShelf', BooksShellSchema);

module.exports = BooksShelf;