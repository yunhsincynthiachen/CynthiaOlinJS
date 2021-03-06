var path = require('path');

var Twote = require('../models/appModel.js').TwoteModel;
var User = require('../models/appModel.js').UserModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var routes = {};

//Add a new twote
routes.createTwote = function(req, res) {
  var b = req.body;

  //Create the new model
  var twote = new Twote();
  twote.author = b.author;
  twote.author_id = b.author_id;
  twote.date_posted = new Date();
  twote.text = b.text;
  twote.deleted = false;
  twote.button = false;

  //save twote
  twote.save(function(err) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    else {
      //Also, find the author and save the id to the author's list of twotes
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

//To delete a tweet, take tweetid and userid. Delete tweet from user list of twotes, and delete twote completely from server
routes.deleteTwote = function(req, res) {
  var tweetid = req.params.tweetid;
  var userid = req.params.userid;

  //Tweet removed from twote models
  Twote.remove({ '_id' : tweetid  }, function(err, removed) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    //Delete tweetid from list of twotes
    User.findByIdAndUpdate(userid, { $pull: { 'twotes': tweetid } },function(err,model){
      if(err){
        return res.send(err);
        }
        res.send(tweetid);
        return;
    });
  });
}

module.exports = routes;