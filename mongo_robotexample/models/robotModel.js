//This type of file is usually found in app/models/robotModel.js
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/robots');

// Create a Schema
var robotSchema = mongoose.Schema({
  name: String,
  abilities: [String],
  isEvil: Boolean
}, {collection: "users"});

module.exports = mongoose.model("robots", robotSchema);