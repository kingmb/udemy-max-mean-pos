var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models').User;

// Create a user
router.post('/', function (req, res, next) {
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
    })
    .then(function (result) {
        res.status(201).json({
            message: 'User created',
            obj: result
        });
    })
    .catch(function (err) {
        res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    });
});

// Signin a user
router.post('/signin', function(req, res, next) {
    User.find({
        where: {
            email: req.body.email
        }
    })
    .then(function (user) {
        if (user) {
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                res.status(401).json({
                    title: 'Login failed',
                    error: {message: 'Invalid login credentials'}
                });
            }
            else {
                var token = jwt.sign({user: user}, '909hDSSSjfa9"§((dplqfdfc5844!_', {expiresIn: 7200});
                res.status(200).json({
                    message: 'Successfully logged in',
                    token: token,
                    userId: user.id
                });
            }
        }
        else {
            res.status(401).json({
                        title: 'Login failed',
                        error: {message: 'Invalid login credentials'}
                    });
        }
    })
    .catch(function (err) {
        res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    });
});

module.exports = router;
