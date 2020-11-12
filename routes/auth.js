const router = require('express').Router();
const passport = require('passport');

let ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('Is authenticated: true');
        return next();
    } else {
        console.log('Not authenticated');
        res.redirect('/auth/login');
    }
};

router.get('/login', (req, res) => {
    res.render('login', {user: req.user});
});

router.get('/google', passport.authenticate('google', {scope: ['profile']}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log('Is authenticated: ' + req.isAuthenticated());
    res.send(req.user);
});

router.get('/user', ensureAuthenticated, (req, res) => {
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
