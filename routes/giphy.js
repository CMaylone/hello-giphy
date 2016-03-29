var express = require('express');
var config = require('config');
var passport = require('passport');
var _ = require('lodash');
var giphyApi = require('giphy-api')({ apiKey: config.get('giphy.apiKey'), https: true });
var router = express.Router();

/**
 * Use giphy random endpoint to get a cat gif passed on supplied querystring params
 */
router.get('', passport.authenticate('basic', { session: false }), function(req, res, next) {
    if (req.isAuthenticated()) {
        var catTags = 'cat';
        if (req.query.tags) {
            if (_.isArray(req.query.tags)) {
                req.query.tags.forEach((tag) => {
                    catTags = catTags.concat(' ', tag);
                })
            } else {
                catTags.concat(' ', req.query.tags);
            }
        }
        
        giphyApi.random(catTags).then(function(response) {
            res.send(response);
        })
    } else {
        res.status(401).send('unauthorized');
    }
});

module.exports = router;