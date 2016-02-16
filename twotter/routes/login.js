var path = require('path');

var Twote = require('../models/appModel.js').TwoteModel;
var User = require('../models/appModel.js').UserModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var routes = {};


//Add a new user: not really used because i couldn't figure out local strategys
routes.createUser = function(req, res) {
  var sess = req.session;
  var b = req.body;
  sess.username = b.name;

  var user = new User();
  user.author = sess.username;

  user.save(function(err) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.send(user);
    return;
  })
};

module.exports = routes;