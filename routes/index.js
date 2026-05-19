const express = require("express");
const router = express.Router();
const session = require('express-session');
const Book = require('../models/Book');
const Author = require('../models/Author');
const Cover = require('../models/Cover');
const User = require('../models/user');
const Rate = require('../models/Rate');
const Genre = require('../models/Genre');
const {verifyToken} = require('../controllers/isAuth');


function reduceAuthors(books){
        var authors = [];
        for (let i=0; i<5; i++){
            if (books[i].author_ids.length > 1){
                authors.push(books[i].author_ids[0].name + " и др.");
                books[i].author_ids.name = books[i].author_ids[0].name + " и др.";   
            }
            else{
                authors.push( books[i].author_ids[0].name);
                books[i].author_ids.name = books[i].author_ids[0].name;
            }

        }
        return books;
}


router.get("/", verifyToken, async (req, res) => {
    if (req.user == "No-user"){
        const books = await Book.find({}).limit(5).sort({rate_count: 1}).populate('author_ids').populate('cover_id');  
        res.render("../views/index.hbs", {books:books});
    }
    else
    {
        const user = await User.findOne({mail: req.cookies.mail});
        const userRates = await Rate.find({user_id: user._id});

        var commentedBooks = [];
        for (let i = 0; i < userRates.length; i++){
            commentedBooks.push(await Book.findOne({_id: userRates[i].book_id}).populate('genre_ids'));    
        }
        var genres = [];
        for (let i = 0; i < commentedBooks.length; i++){
            genres.push(commentedBooks[i].genre_ids[0]._id);
        }

        var recBooksAuthor = await Book.find({author_ids: commentedBooks.author_ids}).populate('cover_id').populate('author_ids').limit(5);

        console.log(recBooksAuthor);
        for (let i=0; i<commentedBooks.length; i++){
            commentedBooks[i] = commentedBooks[i]._id;
        }


        var newBooks = await Book.find({}).sort({year: 1}).limit(5).populate('author_ids').populate('cover_id');
        var recBooksGenre = await Book.find({genre_ids: genres, _id: {$nin : commentedBooks}}).populate('genre_ids').populate('cover_id').populate('author_ids').limit(5);
        var books = await Book.find({}).limit(5).sort({rate_count: 1}).populate('author_ids').populate('cover_id');  

        books = reduceAuthors(books);
        recBooksGenre = reduceAuthors(recBooksGenre);


        res.render("../views/index.hbs", {newBooks: newBooks, genreBooks: recBooksGenre, authorBooks: recBooksAuthor});
    }
});

module.exports = router;

