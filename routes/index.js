const express = require("express");
const router = express.Router();
const session = require('express-session');
const Book = require('../models/Book');
const Author = require('../models/Author');
const Cover = require('../models/Cover');
const User = require('../models/user');
const Rate = require('../models/Rate');


router.get("/", async (req, res) => {

    const books = await Book.find({}).limit(5).sort({rate_count: 1}).populate('author_ids').populate('cover_id');    
    isAuth = false;


    // const user_rates = await Rate.find({user_id: });

    // for (let i = 0; i < user_rates.length; i++) {
    //     const ratedBookCount = await Book.find({_id: user_rates[0].book_id}).countDocuments();
    // }
    
    // const books = await Book.find({}).limit(5).populate('author_ids').populate('cover_id');    
    isAuth = true;

    res.render("../views/index.hbs", {
        books:books,
        isAuth: isAuth
    });

});

module.exports = router;

