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
  if (req.session.user === undefined) {
    res.redirect('/')
  } else {
    res.render('home');
  }
  
});


// POST search journey
router.post('/search', async function(req, res, next) {
  console.log("req.body", req.body);
  
  // var dateFormat = req.body.date //+ "T00:00:00.000Z";

  // Cherche les voyage correspondants
  var journeys = await JourneysModel.find({
    departure: req.body.departure,
    arrival: req.body.arrival,
    date: req.body.date
  });

  //Mise en forme de la date
  var dateArray = req.body.date.split('-')
  var dateFormat = dateArray[2] + "/" + dateArray[1];

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

  console.log("journey", journey);

  if (req.session.journeysSelected) { // if there are already journeys in session
  } else { // Else create the array journeys
    req.session.journeysSelected = [];
  }
  // add the journey to session
  req.session.journeysSelected.push(journey);

  // mettre l'information dans une variable
  var journeys = req.session.journeysSelected;


  res.render('basket', {
    journeys
  })
})

// GET confirm journeys
router.get('/confirm', async function(req, res, next) {

  // Récupérer l'user
  var user = await UsersModel.findById(req.session.user._id);

  // Récupère les trajets déjà effectués et ajoute les nouveaux confirmés
  var tripsIds = user.lastTripsIds;
  for (var i = 0 ; i < req.session.journeysSelected.length ; i++) {
    tripsIds.push(req.session.journeysSelected[i]._id);
  }

  req.session.journeysSelected = [];

  console.log("tripsIds", tripsIds);

  //Update le bdd avec des nouveaux trajets et les anciens
  await UsersModel.updateOne(
    {_id: req.session.user._id},
    {lastTripsIds : tripsIds}
  );  

  // user = await UsersModel.findById(req.session.user._id);
  // Il faudrait mettre une pop up à cet endroit
  res.redirect('/home');
});

// GET My last trips
router.get('/last-trips', async function(req, res, next) {
  if (req.session.user === undefined) {
    res.redirect('/')
  } else {
     // récupérer les voyages déjà effectué depuis la bdd
    var user = await UsersModel.findById(req.session.user._id).populate('lastTripsIds').exec();
    // var user = await UsersModel.findById('60783cbfbafc240850956d89').populate('lastTripsIds').exec();
    var lastTrips = user.lastTripsIds;
    console.log("lastTrips", lastTrips);

    // Renvoie la page
    res.render('last-trips', {
      lastTrips
    })
    
  }

 
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
