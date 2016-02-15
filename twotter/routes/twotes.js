var path = require('path');

var Twote = require('../models/appModel.js').TwoteModel;
var User = require('../models/appModel.js').UserModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var routes = {};

//Add a new twote
routes.createTwote = function(req, res) {
  var b = req.body;

  var twote = new Twote();
  twote.author = b.author;
  twote.author_id = b.author_id;
  twote.date_posted = new Date();
  twote.text = b.text;
  twote.deleted = false;
  twote.button = false;

  twote.save(function(err) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    else {
      User.findOne({"author" : b.author}, function(err, user) {
        var user_twotes = user.twotes;
        user_twotes.push(twote._id)
        user.save(function(err) {
          if (err) {
            res.sendStatus(500);
            return;
          }
          res.send(twote);
          return;
        })
      })
    }
  })
};

routes.deleteTwote = function(req, res) {
  var divid = req.params.divid;
  Twote.remove({ '_id' : divid  }, function(err, removed) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    // User.findOne({ '_id' : })
    res.send(divid);
  });
}

module.exports = routes;