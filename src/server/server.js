const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// TODO: Consider extracting most of this logic into createApp(routes, path) function so that
//   it can be used in unit tests to test each route individually.

const PORT = process.env.PORT || 3001;

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: 'https://vite-production-2ca6.up.railway.app', 
    // origin: 'http://localhost:3000', // NO / at the end
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use((req, res, next) => {
  // check if client sent cookie
  let cookie = req.cookies.testCookie;
  console.log('cookies ---->>>>>>> ', req.cookies);
  if (cookie === undefined) {
    // set a new cookie
    let randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);

    res.cookie('testCookie', randomNumber, { maxAge: 9000000, httpOnly: true, sameSite: 'strict', secure: true });
    console.log('🍪🥠🍪🥠🍪🥠 cookie created successfully');
  } else {
    console.log('🍪🥠🍪🥠🍪🥠 cookie exists', cookie);
  }
  next();
});

app.get('/', (req, res) => {
  // if cookie is present, send it as json back to client
  if (req.cookies.testCookie) {
    res.json({ cookie: req.cookies.testCookie });
  } else {
    res.json({ cookie: 'not set' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at ${PORT}`);

});

module.exports = app;
