const User = require("../models/User");
const passport = require('passport');
const LocalStrategy = require('passport-local-roles').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
    },
    function (email, password, role, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            user.comparePassword(password, (err, isMatch) => {
                if (err) return done(err)
                if (!isMatch) return done(null, false, { message: 'Incorrect password.' })
                return done(null, user)
            });
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});