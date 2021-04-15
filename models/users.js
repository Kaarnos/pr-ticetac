const mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
  lastname: String,
  firstname: String,
  email: String,
  password: String,
  lastTripsIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'journeys'
  }]
});

var UsersModel = mongoose.model('users', usersSchema);

module.exports = UsersModel;