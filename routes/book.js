const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Bookshelf = require("../models/BooksShelf");
const Rate = require("../models/Rate");
const Book = require("../models/Book");
const {generateDescription} = require("../controllers/AIDescriptions");
const BooksShelf = require("../models/BooksShelf");


router.get("/", async (req, res) => {
    var isUser;
    const user = await User.findOne({mail: req.cookies.mail});
    var bookId = req.query.bid; 

    const book = await Book.findOne({_id: bookId}).populate('cover_id').populate('author_ids').populate('genre_ids');
    var rates = await Rate.find({book_id: book._id}).populate('user_id');
    var bookRateSum = 0;
    for (let i=0; i<rates.length; i++){
        bookRateSum += rates[i].rate;
    }
    var bookRate = bookRateSum / rates.length;
    bookRate = bookRate.toFixed(1);

    if (isNaN(bookRate)){
        bookRate = "Нет рейтинга";
    }else{
        bookRate += "/10";
    }

    if (req.cookies.mail){
        isUser = true;
        for (let i=0; i<rates.length; i++){
            if (rates[i].liked_users.includes(user._id)){
                rates[i].isLiked = true;
            }
            else{
                rates[i].isLiked = false;
            }
        }
    }
    else{isUser = false;}

    var bookshelves = await BooksShelf.find({user_id: user._id});


    var description = await generateDescription(book.title);
    res.render("../views/book.hbs", {book:book, isUser:isUser, user:user, bookRate: bookRate, reviews: rates, bookId:bookId, description: description, bookshelves: bookshelves});
});



router.get("/like", async (req, res) => {
    var id = req.query.id;

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }
    
    const user = await User.findOne({mail: req.cookies.mail});
    var rate = await Rate.findOne({_id: id});
    if (req.cookies.mail){  
        if (rate.liked_users.includes(user._id)){
            res.redirect(`/book?bid=${req.query.bid}`);
            }
        else{
            rate.like_count += 1;
            rate.liked_users.push(user._id);

            rate.save()
            res.redirect(`/book?bid=${req.query.bid}`);
        }
    }
}); 


router.get("/unlike", async (req, res) => {
    var id = req.query.id;

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }

    const user = await User.findOne({mail: req.cookies.mail});
    var rate = await Rate.findOne({_id: id});

    if (req.cookies.mail){
        if (rate.liked_users.includes(user._id)){
            rate.like_count -= 1;
            const index = rate.liked_users.indexOf(user._id);
            rate.liked_users.splice(index, 1);

            rate.save()
            res.redirect(`/book?bid=${req.query.bid}`);
        }
        else{
            res.redirect(`/book?bid=${req.query.bid}`);
        }
    }
}); 


router.post("/review", async (req, res) => {
    const user = await User.findOne({mail: req.cookies.mail});

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }

    const { textReview } = req.body;
    const { title } = req.body;
    const id = req.query.id;
    var { rate } = req.body;
    rate = parseInt(rate);

    const urate = await Rate.findOne({user_id: user._id, book_id: id});
    if (req.cookies.mail){
        try{
            if (urate == [] || urate === null){
                var review = await Rate.create([
                {
                    book_id: id,
                    user_id: user._id,
                    rate: rate,
                    comment: textReview,
                    like_count: 0,
                    isLiked: false,
                    title: title,
                    liked_users: [],
                }
                ]);

                var book = await Book.findOne({_id: id});
                book.rate_count += 1;
                book.save();
                res.redirect(`/book?bid=${id}`);
            }
            else{
                console.log("привет");
                throw Error;
            }
       }
        catch{
            res.redirect(`/book?bid=${id}`);
        }
    }
    else{
        res.redirect(`/book?bid=${id}`);
    }
});


router.get("/add", async (req, res) => {
    var shelfId = req.query.id;
    var bookId = req.query.bid;

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }
    
    const user = await User.findOne({mail: req.cookies.mail});
    var bookShelf = await BooksShelf.findOne({_id: shelfId});
    var bookId = await Book.findOne({_id: bookId});

    if (req.cookies.mail){
        bookShelf.shelf_books.push(bookId._id);

        bookShelf.save()
        res.redirect(`/book?bid=${req.query.bid}`);
    }
    else{
        res.redirect(`/book?bid=${req.query.bid}`);
        }
}); 


module.exports = router;


