const mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
  lastname: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  lastTripsIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'journeys'
  }]
});

var UsersModel = mongoose.model('users', usersSchema);

module.exports = UsersModel;