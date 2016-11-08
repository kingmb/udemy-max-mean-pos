var User = require('../models').User;
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index');
    // res.render('node'); // This is for testing the node.hbs and the '/testHBS' paths 
});



// Routes for the testing of node.hbs
router.get('/testHBS', function (req, res, next) {
    User
      .findOne({
        order:  [['id', 'DESC']]
      })
      .then(function(user) {
          res.render('node', {email: user.email});
        })
      .catch(function(error) {
          res.send('Error!' + error)
       });
});

router.post('/testHBS', function (req, res, next) {
    var email = req.body.email;
    User
      .build({
        firstName: 'Max',
        lastName: 'Schwarz',
        password: 'super-secret',
        email: email
        })
       .save()
       .success(function() { res.redirect('/');})
       .error(function(error) {
          res.send('Error!' + error)
       });
});


module.exports = router;
