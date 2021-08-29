const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true,
        },
        role: {
            type: String,
            enum: ["salesperson", "admin", "manager"]
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);



UserSchema.pre('save', function (next) {
    const user = this;
    const saltRounds = 10;
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });

});

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
    bcrypt.compare(passwordAttempt, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        } else {
            return cb(err, isMatch);
        }
    });
};

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);