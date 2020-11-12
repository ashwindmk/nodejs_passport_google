const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/User');

passport.use(
    new GoogleStrategy({
            callbackURL: '/auth/google/redirect',
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret
        }, 
        (accessToken, refreshToken, profile, done) => {
            console.log('Received the profile: ' + JSON.stringify(profile));

            User.findOne({googleId: profile.id})
                .then((user) => {
                    if (user) {
                        console.log('User already exists: ' + user);
                        done(null, user);
                    } else {
                        new User({
                            username: profile.displayName,
                            googleId: profile.id
                        }).save()
                            .then((newUser) => {
                                console.log('New user created: ' + newUser);
                                done(null, newUser);
                            })
                            .catch((err) => console.error(err));
                    }
                })
                .catch((err) => console.error(err));
        }
    )
);

// Sending user to cookie
passport.serializeUser((user, done) => {
    console.log('User to be serialized: ' + user);
    console.log('User.id: ' + user.id + ', user._id: ' + user._id);
    done(null, user.id);
});

// Getting user from cookie
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            console.log('Deserialized user: ' + user);
            done(null, user);
        });
});
