const express = require('express');
const session = require('express-session');
// const session = require('cookie-session');
const passport = require('passport');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = express();

app.set('view engine', 'ejs');

//app.use(cookieParser());
app.use(session({
    secret: keys.session.cookieKey,
    resave: true,
    saveUninitialized: true
}));
// app.use(session({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [keys.session.cookieKey]
// }));
// app.use(express.cookieParser(keys.session.cookieKey));
// app.use(express.cookieSession({
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000
//   }
// }));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongodb.dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Mongodb connected'))
    .catch((e) => console.error('Mongodb connect error: ' + e));

app.use('/auth', authRouter);
app.use('/profile', profileRouter);

app.get('/', (req, res) => {
    res.render('home', {user: req.user});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('App listening on port ' + PORT));
