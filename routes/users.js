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

  var user = await UsersModel.findOne({
    email: req.body.email
  });

  console.log("user", user);

  if (user === null) {
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
    res.redirect('/home');
    // res.json('redirect to home page');
    
  } else {
    console.log("This email address is already used");
    // Redirect to login page
    res.redirect('/')
  }


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
    console.log("bad authentification");
    // Redirect to login
    res.redirect('/');
    // res.json('bad authentification, redirect to login page')
  } else { // if found
    // Save to session
    req.session.user = user;
    var response = {
      message: 'redirect to home page',
      user: user
    };
    // Redirect to home page
    res.redirect('/home');
    // res.json(response)
  }
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  console.log("session", req.session);
  res.redirect('/');
})



module.exports = router;
