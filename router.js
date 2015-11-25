var express = require("express");
var router = new express.Router;
var passport = require('passport');

router.route('/')
    .get(function(req,res){
        res.render('layout');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.flash('error', 'You have to sign in to see this content');
    res.redirect('/login/login');
}

function andRestrictTo(role) {
    return function(req, res, next) {
        if (req.user.role == role) {
            next();
        } else {
            res.status(403).send('mennyinnen');
        }
    };
}

router.route('/login/login')
    .get(function (req, res) {
        res.render('login/login', {
            uzenetek: req.flash()
        });
    })
    .post(passport.authenticate('local-login', {
        successRedirect: '/list',
        failureRedirect: '/login/login',
        failureFlash: true,
        badRequestMessage: 'Hibás felhasználó vagy jelszó!'
    }));
    
router.route('/login/signup')
    .get(function (req, res) {
        res.render('login/signup', {
            uzenetek: req.flash()
        });
    })
    .post(passport.authenticate('local-signup', {
        successRedirect:    '/login/login',
        failureRedirect:    '/login/signup',
        failureFlash:       true,
        badRequestMessage:  'Hiányzó adatok'
    }));

router.use('/login/logout', function (req, res) {
    req.logout();
    res.redirect('/login/login');
});

router.route('/list')
    .get(ensureAuthenticated, function (req, res) {
        var result;
        
        // if (req.query.kereses) {
        //     result = req.app.models.error.find({
        //         leiras: { 'contains': req.query.kereses }
        //     });
        // } else {
            result = req.app.models.game.find();
        // }
        
        result.then(function (games) {
            res.render('list', {
                // uzenetek: req.flash(),
                games: games
            });
        });
});

router.route('/add')
    .get(ensureAuthenticated, function (req, res) { 
        res.render('add', {
            uzenetek: req.flash()
        }); 
    })
    .post(ensureAuthenticated, function (req, res) {
        req.checkBody('bteamname').notEmpty().withMessage('Kihagytál valamit!');
        if (req.validationErrors()) {
            req.validationErrors().forEach(function (error) {
                req.flash('error', error.msg);
            });
            res.redirect('/add');
        } else {
            req.app.models.game.create({
                //date: req.body.date,
                redTeam: req.body.rteamname,
                blueTeam: req.body.bteamname,
                blue1: req.body.bchamp1,
                blue2: req.body.bchamp2,
                blue3: req.body.bchamp3,
                blue4: req.body.bchamp4,
                blue5: req.body.bchamp5,
                red1: req.body.rchamp1,
                red2: req.body.rchamp2,
                red3: req.body.rchamp3,
                red4: req.body.rchamp4,
                red5: req.body.rchamp5,
                rside: req.body.rside,
                bside: req.body.bside,
            })
                .then(function () {
                req.flash('success', 'Saved.');
                res.redirect('/add'); 
            });
        }
    });

    
router.route('/edit/:id')
.get(ensureAuthenticated, function (req, res) {
    req.app.models.game.findOne({
        id: req.params.id
    }).then(function (game) {
        res.render('edit', {
            game: game
        });
    });
})
    .post(ensureAuthenticated, function (req, res) {
        if (req.validationErrors()) {
            req.validationErrors().forEach(function (error) {
                req.flash('error', error.msg);
            });
            res.redirect('/edit');
        } else {
            req.app.models.game.update({id: req.params.id},{
                //date: req.body.date,
                redTeam: req.body.rteamname,
                blueTeam: req.body.bteamname,
                blue1: req.body.bchamp1,
                blue2: req.body.bchamp2,
                blue3: req.body.bchamp3,
                blue4: req.body.bchamp4,
                blue5: req.body.bchamp5,
                red1: req.body.rchamp1,
                red2: req.body.rchamp2,
                red3: req.body.rchamp3,
                red4: req.body.rchamp4,
                red5: req.body.rchamp5,
                rside: req.body.rside,
                bside: req.body.bside,
            })
                .then(function () {
                req.flash('success', 'Saved.');
                res.redirect('/list'); 
            });
        }
});
    
router.route('/game/:id')
    .get(ensureAuthenticated, function (req, res) {
        req.app.models.game.findOne({
            id: req.params.id
        }).then(function (game) {
            res.render('game', {
                game: game
            });
        });
});

router.route('/win/:id')
    .get(ensureAuthenticated, function (req, res) {
        req.app.models.game.update({
            id: req.params.id
        }, {
            rsidewin: true
        }).then(function () {
            res.redirect('/list');  
        });
});
    
router.route('/delete/:id')
    .get(ensureAuthenticated, andRestrictTo('operator'), function (req, res) {
        req.app.models.game.destroy({
            id: req.params.id
        }).then(function () {
            req.flash('success', 'Game was deleted.');
            res.redirect('/list');  
        });
    });    
module.exports = router;