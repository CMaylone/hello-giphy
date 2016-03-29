var assert = require('assert');
var request = require('supertest');
var app = require('../index');
var User = require('../models/user');

describe('Hello-Giphy', function() {
    after(function(done) {
        // Clean-up all test users
        User.remove({}, done);
    });

    describe('POST /users', function() {
        it('should create new a user', function(done) {
            var userData = {
                username: 'JMcClane',
                password: 'diehard'
            };

            request(app)
                .post('/api/1/user')
                .send(userData)
                .expect(200)
                .end(function(err, res) {
                    assert(res.body.username, userData.username);
                    assert.equal(res.body.password, undefined, 'password should be sanitized');
                    done(err);
                })
        });

        it('should hash passwords', function(done) {
            var userData = {
                username: 'BCambell',
                password: 'groovy'
            };

            request(app)
                .post('/api/1/user')
                .send(userData)
                .expect(200)
                .end(function(err, res) {
                    User.findById(res.body._id, function(err, user) {
                        assert.notEqual(user.password, userData.password, 'password should not be cleartext');
                        user.verifyPassword(userData.password, function(err, valid) {
                            assert(valid);
                            done();
                        })
                    })
                })
        })

        it('should return an error when username parameter is not defined', function(done) {
            var userData = {
                username: 'JMcClane'
            };

            request(app)
                .post('/api/1/user')
                .send(userData)
                .expect(400)
                .end(done);
        });

        it('should return an error when password parameter is not defined', function(done) {
            var userData = {
                password: 'superSecurePassword'
            };

            request(app)
                .post('/api/1/user')
                .send(userData)
                .expect(400)
                .end(done);
        });
    });


    describe('GET /giphy', function() {

        it('should return unauthorized if invalid credentials are supplied', function(done) {
            request(app)
                .get('/api/1/giphy')
                .expect(401)
                .end(done);
        });

        it('should return JSON', function(done) {
            var userData = {
                username: 'JSmith',
                password: 'drowssap'
            };

            // Create a new user to be used for authentication
            request(app)
                .post('/api/1/user')
                .send(userData)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        done(err);
                    } else {
                        request(app)
                            .get('/api/1/giphy')
                            .auth(userData.username, userData.password)
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .end(done);
                    }
                });
        })

    });

});
