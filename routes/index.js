var express = require('express');
var router = express.Router();

var JourneysModel = require('../models/journeys');
const UsersModel = require('../models/users');

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

// GET home page
router.get('/home', function(req, res, next) {
  res.render('home');
});

// GET search TEST *****************
router.get('/search-result', function(req, res, next){
  res.render('search-resultat')
});

// GET Basket User ********
router.get('/basket', function(req,res, next){
  res.render('user-basket')
});
router.get('/aaa', function(req,res, next) {
  res.render('search-result');
})

// POST search journey
router.post('/search', async function(req, res, next) {
  console.log("req.body", req.body);


  
  // var dateFormat = req.body.date //+ "T00:00:00.000Z";

  var journeys = await JourneysModel.find({
    departure: req.body.departure,
    arrival: req.body.arrival,
    date: req.body.date
  });

  var dateArray = req.body.date.split('-')
  var dateFormat = dateArray[2] + "/" + dateArray[1];

  // var response = {
  //   message: "render journeys list",
  //   journeys: journeys
  // };

  // res.json(response);
  console.log("journeys", journeys);

  res.render('search-result', {
    journeys,
    dateFormat
  })
})

// GET select journey
router.get('/select', async function (req, res, next) {
  console.log("req.query", req.query);

  // Get the journey from DB
  var journey = await JourneysModel.findById(req.query.id);
  // console.log('req.session.journeys', req.session.journeys);

  if (req.session.journeysSelected) { // if there are already journeys in session
  } else { // Else create the array journeys
    req.session.journeysSelected = [];
  }
  // add the journey to session
  req.session.journeysSelected.push(journey);
  // req.session.user = {_id: "6077fe9f17050d2410bc9f19"};

  var response = {
    message: "render My Tickets",
    journeysSelected: req.session.journeysSelected
  };
  res.json(response);
})

// GET confirm journeys
router.get('/confirm', async function(req, res, next) {
  // console.log("req.query", req.query);
  var user = await UsersModel.findById(req.session.user._id);

  var tripsIds = user.lastTripsIds;
  for (var i = 0 ; i < req.session.journeysSelected.length ; i++) {
    tripsIds.push(req.session.journeysSelected[i]._id);
  }

  console.log("tripsIds", tripsIds);

  await UsersModel.updateOne(
    {_id: req.session.user._id},
    {lastTripsIds : tripsIds}
  );  

  user = await UsersModel.findById(req.session.user._id);
  

  var response = {
    message: "pop up: Thank you for your purchase!",
    user: user
  };
  res.json(response);
})

// GET My last trips
router.get('/last-trips', async function(req, res, next) {

  var user = await UsersModel.findById(req.session.user._id).populate('lastTripsIds').exec();

  var lastTrips = user.lastTripsIds;
  
  var response = {
    message: "render My Last Trips",
    lastTrips: lastTrips
  };
  res.json(response);
})



// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new JourneysModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    JourneysModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});

module.exports = router;
