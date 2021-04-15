const mongoose = require('mongoose');

var journeysSchema = mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  departureTime: String,
  price: Number,
});

var JourneysModel = mongoose.model('journeys', journeysSchema);

module.exports = JourneysModel;