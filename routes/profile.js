const router = require('express').Router();

router.get('/', (req, res) => {
    if (!req.user) {
        res.redirect('/auth/login');
    } else {
        res.render('profile', {user: req.user});
    }
});

module.exports = router;
