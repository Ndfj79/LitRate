const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Bookshelf = require("../models/BooksShelf");
const Book = require("../models/Book");
const {generateDescription} = require("../controllers/AIDescriptions");



router.get("/", async (req, res) => {
    var bookshelf = await Bookshelf.findOne({_id: req.query.id}).populate('user_id');
    const user = await User.findOne({mail: req.cookies.mail});
    var isUser;
    var books = [];
    for (let i=0; i<bookshelf.shelf_books.length; i++){
        books.push(await Book.findOne({_id: bookshelf.shelf_books[i]}).populate('author_ids').populate('cover_id').populate('genre_ids'));
    }

    if (req.cookies.mail){
        isUser = true;
        if (bookshelf.liked_users.includes(user._id)){
            bookshelf.isLiked = true;
        }
        else{
            bookshelf.isLiked = false;
        }
    }
    else{isUser = false;}

    res.render("../views/bookShelf.hbs", {isUser: isUser, user:user, bookshelf: bookshelf, books: books});

});


router.get("/like", async (req, res) => {
    var id = req.query.id;
    const user = await User.findOne({mail: req.cookies.mail});
    var bookshelf = await Bookshelf.findOne({_id: id});

    if (req.cookies.mail){
        if (bookshelf.liked_users.includes(user._id)){
            res.redirect(`/bookshelf?id=${bookshelf._id}`);
        }
        else{
            bookshelf.like_count += 1;
            bookshelf.liked_users.push(user._id);

            bookshelf.save()
            res.redirect(`/bookshelf?id=${bookshelf._id}`);
        }
    }
}); 


router.get("/unlike", async (req, res) => {
    var id = req.query.id;
    const user = await User.findOne({mail: req.cookies.mail});
    var bookshelf = await Bookshelf.findOne({_id: id});

    if (req.cookies.mail){
        if (bookshelf.liked_users.includes(user._id)){
            bookshelf.like_count -= 1;
            const index = bookshelf.liked_users.indexOf(user._id);
            bookshelf.liked_users.splice(index, 1);

            bookshelf.save()
            res.redirect(`/bookshelf?id=${bookshelf._id}`);
        }
        else{
            res.redirect(`/bookshelf?id=${bookshelf._id}`);
        }
    }
}); 



module.exports = router