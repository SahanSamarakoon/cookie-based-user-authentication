const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require('passport');

const router = require('./routes/routes');
const { DB, PORT, SECRET } = require("./config");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(session({
    name: 'session-id',
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use("/",require("./routes/mainRoutes") );
// app.use("/",require("./routes/test") );

mongoose.connect(
    DB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Connected to the DB");
        }
    }
);
mongoose.set("useCreateIndex", true);

app.listen(PORT, () => {
    console.log("Server started on port:" + PORT);
})

router(app);

