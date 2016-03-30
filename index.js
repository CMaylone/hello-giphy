var express = require('express');
var mongoose = require('mongoose');
var config = require('config');
var path = require('path');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var bodyParser = require('body-parser');
var User = require('./models/user');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Configure passport with http basic auth strategy
 */
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new BasicStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                return done(err);
            } else if (!user) {
                return done(undefined, false);
            } else {
                user.verifyPassword(password, function(err, valid) {
                    if (!valid) {
                        return done(undefined, false);
                    } else {
                        return done(undefined, user);
                    }
                })
            }
        });
    }
));

// Get routers and create API routes.
const BASE_URL = '/api/:version/';
app.use(path.join(BASE_URL, 'user'), require('./routes/user'));
app.use(path.join(BASE_URL, 'giphy'), require('./routes/giphy'));

mongoose.connect(process.env.MONGOLAB_URI || config.get('db.uri'), function(err) {
    if (err) {
        throw new Error(err); // Fail fast if we can't connnect to MongoDB
    } else {
        var server = app.listen(process.env.PORT || config.get('port'), function() {
            console.log('hello-giphy is listening on port', server.address().port)
        });
    }
});

// Export the express app so we can use it for testing
module.exports = app;
