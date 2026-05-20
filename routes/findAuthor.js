const express = require("express");
const router = express.Router();
const Book = require('../models/Book');
const {reduceAuthors} = require('../controllers/reduceAuthors');
const User = require('../models/user');
const Author = require("../models/Author");
const { AutoEncryptionLoggerLevel } = require("mongodb");


router.get("/", async (req, res) => {
    var isUser;
    const user = await User.findOne({mail: req.cookies.mail});
    if (req.cookies.mail){
        isUser = true;
    }
    else{
        isUser = false;
    }
    res.render("../views/authors.hbs", {isUser: isUser, user: user});

});

router.post("/", async (req, res) => {
    var isUser;
    var isPost = true;
    const user = await User.findOne({mail: req.cookies.mail});
    if (req.cookies.mail){
        isUser = true;
    }
    else{
        isUser = false;
    }
    const { searchText } = req.body;
    var author = await Author.find({name: { $regex: searchText, $options: 'i' }});
    var books = await Book.find({author_ids: author[0]._id}).populate('author_ids').populate('cover_id').populate('genre_ids').limit(5);
    books = reduceAuthors(books);

    res.render("../views/authors.hbs", {isUser: isUser, user: user, isPost: isPost, books:books});
});

module.exports = router
