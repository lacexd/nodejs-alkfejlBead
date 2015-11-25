var express = require("express");
var app = express();

var hbs = require("hbs");
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var session = require("express-session");
app.use(session(
    {
        cookie: { maxAge: 60000 },
        secret: 'titkos szoveg',
        resave: false,
        saveUninitialized: false,
    }
));


var passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

var LocalStrategy = require('passport-local');
passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },   
    function(req, username, password, done) {
        req.app.models.user.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, { message: 'Username already exists' });
            }
            req.app.models.user.create(req.body)
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            });
        });
    }
));

passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, username, password, done) {
        req.app.models.user.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Wrong password or username' });
            }
            return done(null, user);
        });
    }
));

function setLocalsForLayout() {
    return function (req, res, next) {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    };
}

app.use(setLocalsForLayout());


var bodyParser = require("body-parser");
var flash = require("connect-flash");
var validator = require("express-validator");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(validator());

//app.use('public', express.static(__dirname + '/public'));


var router = require("./router");
app.use(router);

var Waterline = require("waterline");
var diskAdapter = require("sails-disk");

var orm = new Waterline();
var ormConfig = {
    adapters: {
        disk: diskAdapter
    },
    connections: {
        disk: {
            adapter: 'disk'
        }
    },
    defaults: {
        migrate: 'alter'
    }
};

orm.loadCollection(require('./models/game'));
orm.loadCollection(require('./models/user'));


orm.initialize(ormConfig, function (err, models) {
    if (err) throw err;
    var port = process.env.PORT || 1337;
    
    app.models = models.collections;
    
    app.listen(port);
});