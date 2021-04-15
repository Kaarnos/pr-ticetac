var express = require('express');
var router = express.Router();
var UsersModel = require('../models/users');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// POST Sign In 
router.post('/sign-up', async function(req, res, next) {
  console.log("req.body", req.body);

  // Creation new user
  var newUser = new UsersModel({
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password
  });

  // Save to DB
  await newUser.save();

  // Save to session
  req.session.user = newUser;

  // Redirect to homepage
  res.json('redirect to home page');
});

router.post('/sign-in', async function(req, res, next) {
  console.log('req.body', req.body);

  // get user if it's in DB
  var user = await UsersModel.findOne({
    email: req.body.email,
    password: req.body.password
  });

  // redirections
  if (user === null) { // if user not found
    // Add a pop up "bad authentification"
    // Redirect
    res.json('bad authentification, redirect to login page')
  } else { // if found
    // Save to session
    req.session.user = user;
    var response = {
      message: 'redirect to home page',
      user: user
    };
    // Redirect
    res.json(response)
  }
  
})



module.exports = router;
