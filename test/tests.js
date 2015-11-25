var expect = require("chai").expect;

var Waterline = require('waterline');
var diskAdapter = require('sails-disk');
var userCollection = require('../models/user');
var workCollection = require('../models/game');
var bcrypt = require('bcryptjs');

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
console.log("asd");
var User;

before(function (done) {
    var orm = new Waterline();

    orm.loadCollection(userCollection);
    orm.loadCollection(workCollection);

    orm.initialize(ormConfig, function(err, models) {
        if(err) throw err;
        User = models.collections.user;
        done();
    });
});

describe('#UserTest', function () {
    before(function (done) {
        User.destroy({username: 'abcdef'}, function (err) {
            if (err) throw err;
            done();
        });
    });
    it('creating new user', function () {
       return User.create({
            username: 'abcdef',
            password: 'jelszo',
            surname: 'Gipsz',
            forename: 'Jakab',
        })
        .then(function (user) {
            expect(user.username).to.equal('abcdef');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.surname).to.equal('Gipsz');
            expect(user.forename).to.equal('Jakab');
        });
   });
   
   it('finding user', function() {
    return User.findOneByUsername('abcdef')
    .then(function (user) {
            expect(user.username).to.equal('abcdef');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.surname).to.equal('Gipsz');
            expect(user.forename).to.equal('Jakab');
        });
    });
    
    it('error / invalid data', function () {
        return expect(User.create({
            username: 'abcdef',
            password: 'jelszo',
            surname: 'Gipsz',
            forename: 'Jakab',
            role: 'hihihi'
        })).to.throw;
    });    
});

describe('#validPassword', function() {
    beforeEach(function (done) {
        User.destroy({username: 'abcdef'}, function (err) {
            if (err) throw err;
            done();
        });
    });
    it('returns true when password is ok', function() {
         return User.create({
            username: 'abcdef',
            password: 'jelszo',
            surname: 'Gipsz',
            forename: 'Jakab',
        }).then(function(user) {
             expect(user.validPassword('jelszo')).to.be.true;
         })
    });
    it('returns false when password is wrong ', function() {
         return User.create({
            username: 'abcdef',
            password: 'jelszo',
            surname: 'Gipsz',
            forename: 'Jakab',
        }).then(function(user) {
             expect(user.validPassword('titkos')).to.be.false;
         })
    });
});