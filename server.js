const express = require("express");
const { engine } = require('hbs');
const proxy = require('express-http-proxy');
const session = require('express-session');
var  dbConnect = require('./db');
const cookieParser = require('cookie-parser');


const app = express();
const port = 3000;
const TIMEOUT_MS = 10000; 
const MAX_RETRIES = 3;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
dbConnect();

app.set('view engine', 'hbs');


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
var userRouter = require("./routes/userRouter");
var search = require("./routes/search");

app.use('/', index);
app.use('/book', book);
app.use('/bookshelf', bookshelf);
app.use('/bookshelves', bookshelfs);
app.use('/findAuthor', findAuthor);
app.use('/findUser', findUser);
app.use('/genres', genres);
app.use('/signin', login);
app.use('/newBooks', newBooks);
app.use('/signup', registration);
app.use('/reviews', reviews);
app.use('/profile', userAccount);
app.use('/api/v1/user', userRouter);
app.use('/search', search);


app.get('/proxy/image', async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl || !isValidImageUrl(imageUrl)) {
    return res.status(400).json({ error: 'Некорректный или небезопасный URL' });
  }

  // console.log(`[Proxy] Fetching: ${imageUrl}`);

  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'ru,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Fetch-Dest': 'image',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'cross-site',
          'Connection': 'keep-alive'
        },
        redirect: 'follow',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Source responded with ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type') || '';

      // console.log(`[Proxy] Status: ${response.status}, Size: ${buffer.length} bytes, Type: ${contentType}`);

      if (buffer.length < 500 || !contentType.startsWith('image/')) {
        throw new Error(`Invalid image data: size=${buffer.length}, type=${contentType}`);
      }

      res.set({
        'Content-Type': contentType.split(';')[0].trim(),
        'Content-Length': buffer.length,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      });
      return res.send(buffer);

    } catch (err) {
      lastError = err;
      // console.error(`[Proxy] Attempt ${attempt + 1} failed for ${imageUrl}: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }

  console.error(`[Proxy] All retries exhausted for ${imageUrl}`);
  res.status(502).json({
    error: 'Не удалось загрузить изображение после нескольких попыток',
    details: lastError?.message
  });
});

function isValidImageUrl(url) {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    const hostname = parsed.hostname;
    if (['localhost', '127.0.0.1', '[::1]'].includes(hostname) ||
        hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

