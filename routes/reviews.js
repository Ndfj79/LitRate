const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Bookshelf = require("../models/BooksShelf");
const Rate = require("../models/Rate");

router.get("/", async (req, res) => {
    var isUser;
    var isPost = false;
    const user = await User.findOne({mail: req.cookies.mail});
    var rates = await Rate.find({}).sort({like_count: -1}).populate('user_id').limit(7);

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
    res.render("../views/reviews.hbs", {isUser: isUser, user:user, reviews: rates, isPost: isPost});
});


router.post("/", async (req, res) => {
    var isUser;
    var isPost = true;
    const user = await User.findOne({mail: req.cookies.mail});
    const { searchText } = req.body;

    var rates = await Rate.find({title: { $regex: searchText, $options: 'i' }}).sort({like_count: -1}).populate('user_id');
    console.log(rates);

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

    res.render("../views/reviews.hbs", {isUser: isUser, user:user, reviews: rates, isPost: isPost});

});


router.get("/like", async (req, res) => {
    var id = req.query.id;
    const user = await User.findOne({mail: req.cookies.mail});
    var rate = await Rate.findOne({_id: id});

    if (req.cookies.mail){
        if (rate.liked_users.includes(user._id)){
                res.redirect("/reviews");
            }
        else{
            rate.like_count += 1;
            rate.liked_users.push(user._id);

            rate.save()
            res.redirect("/reviews");
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
            res.redirect("/reviews");
        }
        else{
            res.redirect("/reviews");
        }
    }
}); 


module.exports = router