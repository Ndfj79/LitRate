const express = require("express");
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');


var index = require("./routes/index");
var book = require("./routes/book");
var bookshelf = require("./routes/bookShelf");
var bookshelfs = require("./routes/bookShelfs");
var findAuthor = require("./routes/findAuthor");
var findUser = require("./routes/findUser");
var genres = require("./routes/genres");
var login = require("./routes/login");
var newBooks = require("./routes/newBooks");
var registration = require("./routes/registration");
var reviews = require("./routes/reviews");
var userAccount = require("./routes/userAccount");


app.use('/', index);
app.use('/book', book);
app.use('/bookshelf', bookshelf);
app.use('/bookshelfs', bookshelfs);
app.use('/findAuthor', findAuthor);
app.use('/findUser', findUser);
app.use('/genres', genres);
app.use('/login', login);
app.use('/newBooks', newBooks);
app.use('/registration', registration);
app.use('/reviews', reviews);
app.use('/userAccount', userAccount);


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

