const User = require('../models/User');
const passport = require('passport');

function setUserInfo(request) {
    return {
        _id: request._id,
        email: request.email,
        role: request.role,
    };
}

exports.login = function (req, res, next) {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    req.login(user, (err) => {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect("/secrets");
            });
        }
    });
};

exports.logout = function (req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect("/login");
};

exports.register = function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;
    if (!email) {
        return res.status(422).send({ error: 'You must enter an email address' });
    }
    if (!password) {
        return res.status(422).send({ error: 'You must enter a password' });
    }
    User.findOne({ email: email }, function (err, existingUser) {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res
                .status(422)
                .send({ error: 'That email address is already in use' });
        }
        var user = new User({
            email: email,
            password: password,
            role: role,
        });
        user.save(function (err, user) {
            if (err) {
                return next(err);
            }
            var userInfo = setUserInfo(user);
            res.status(201).json({
                user: userInfo,
            });
        });
    });
};

exports.roleAuthorization = function (req, res, next) {
    console.log(req.user.role);
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.send("Fail-Session");
    }
};
