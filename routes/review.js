const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Rate = require("../models/Rate");
const Book = require("../models/Book");

router.get("/", async (req, res) => {
    var isUser;
    const user = await User.findOne({mail: req.cookies.mail});
    var rate = await Rate.findOne({_id: req.query.id}).populate('user_id');
    var book = await Book.findOne({_id: rate.book_id}).populate('cover_id').populate('author_ids');    


    if (req.cookies.mail){
        isUser = true;
        if (rate.liked_users.includes(user._id)){
            rate.isLiked = true;
        }
        else{
            rate.isLiked = false;
        }
    }
    else{isUser = false;}
    res.render("../views/review.hbs", {isUser: isUser, user:user, review: rate, book: book});
});


router.get("/like", async (req, res) => {
    var id = req.query.id;
    const user = await User.findOne({mail: req.cookies.mail});
    var rate = await Rate.findOne({_id: id});

    if (req.cookies.mail){
        if (rate.liked_users.includes(user._id)){
                res.redirect(`/review?id=${rate._id}`);
            }
        else{
            rate.like_count += 1;
            rate.liked_users.push(user._id);

            rate.save()
            res.redirect(`/review?id=${rate._id}`);
        }
    }
}); 


router.get("/unlike", async (req, res) => {
    var id = req.query.id;
    const user = await User.findOne({mail: req.cookies.mail});
    var rate = await Rate.findOne({_id: id});
    
    if (req.cookies.mail){
        if (rate.liked_users.includes(user._id)){
            rate.like_count -= 1;
            const index = rate.liked_users.indexOf(user._id);
            rate.liked_users.splice(index, 1);

            rate.save()
            res.redirect(`/review?id=${rate._id}`);
        }
        else{
            res.redirect(`/review?id=${rate._id}`);
        }
    }
}); 


module.exports = router