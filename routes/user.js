var express = require('express');
var router = express.Router();
var User = require('../models/user');

/**
 * Create a new user
 */
router.post('', validateBody, function(req, res, next) {
    // Get username and password from parameters
    var user = new User(req.body);
    user.save(function(err, user) {
        if (err) {
            next(err);
        } else {
            console.log('Created new user:', user)
            res.send(user.sanitize());
        }
    })
});

/**
 * Perform simple validation on body input.
 */
function validateBody(req, res, next) {
    if (!req.body) {
        res.status(400).send('username and password parameters are not defined')
    } else if (!req.body.username) {
        res.status(400).send('username parameter is not defined')
    } else if (!req.body.password) {
        res.status(400).send('password parameter is not defined')
    } else {
        next();
    }
}

module.exports = router;