const AuthenticationController = require('../controllers/authentication'),
    express = require('express'),
    passportService = require('../middlewares/passport');

module.exports = function (app) {
    const apiRoutes = express.Router(),
        authRoutes = express.Router();

    // Auth Routes
    apiRoutes.use('/', authRoutes);
    authRoutes.get("/register", (req, res) => {
        res.render("register");
    });
    authRoutes.get("/login", (req, res) => {
        res.render("login");
    });

    authRoutes.get("/logout", AuthenticationController.logout);
    
    authRoutes.get("/secrets", AuthenticationController.roleAuthorization);

    authRoutes.post('/login', AuthenticationController.login);
    authRoutes.post("/register", AuthenticationController.register);

    

    // Set up routes
    app.use('/', apiRoutes);
};