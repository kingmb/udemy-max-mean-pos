var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models').User;
var Message = require('../models').Message;

// Read all messages
router.get('/', function (req, res, next) {
    Message.findAll({
        include: [{
            model: User
        }]
    })
    .then(function (result) {
        res.status(200).json({
            message: 'Success',
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

// Test user for each request
router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, '909hDSSSjfa9"§((dplqfdfc5844!_', function (err, decoded) {
        if (err) {
            res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        else {
            next();
        }
    })
});

// Save one message
router.post('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);    
    User.findById(decoded.user.id)
    .then(function (user) {
        Message.create({
            content: req.body.content,
            user: user.id
        })
        .then(function (result) {
            // No need for the following two lines in sql, we have no field messages in the user table 
            //user.messages.push(result);
            //user.save();
            result.dataValues.User = user
            res.status(201).json({
                message: 'Saved message',
                obj: result
            });
        })
        .catch(function (err) {
            res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        });
    })
    .catch(function (err) {
        res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    })
});

// Update one message
router.patch('/:id', function (req, res, next) {
    Message.findById( req.params.id)
    .then(function (message) {
        if (message) {
            var decoded = jwt.decode(req.query.token);
            if (message.user != decoded.user.id) {
                res.status(401).json({
                    title: 'Not Authenticated',
                    error: {message: 'Users do not match'}
                });
            }
            else {
                message.update({
                    content: req.body.content
                })
                .then(function (result) {
                    res.status(200).json({
                        message: 'Updated message',
                        obj: result
                    });
                })
                .catch(function (err) {
                    res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                });
            }
        }
        else {
            res.status(500).json({
                title: 'No Message Found!',
                error: { message: 'Message not found' }
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

// Delete one message
router.delete('/:id', function (req, res, next) {
    Message.findById(req.params.id)
    .then(function (message) {
        if (message) {
            var decoded = jwt.decode(req.query.token);
            if (message.user != decoded.user.id) {
                res.status(401).json({
                    title: 'Not Authenticated',
                    error: {message: 'Users do not match'}
                });
            }
            else {
                message.destroy()
                .then(function (result) {
                    res.status(200).json({
                        message: 'Deleted message',
                        obj: result
                    });
                })
                .catch(function (err) {
                    res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                });
            }

        }
        else {
            res.status(500).json({
                title: 'No Message Found!',
                error: { message: 'Message not found' }
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