var express = require('express');
var router = express.Router();

var Twote = require('../models/appModel.js').TwoteModel;
var User = require('../models/appModel.js').UserModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var async = require("async");


//Goes through all tweets and figures out if it's that particular author's tweet, so delete buttons only show on those tweets
var setBooleanTweets = function (authorname, alltwotes){ //takes in authorname and all twotes in array
  var with_boolean = new Array(); //gets filled with modified objects 

  for (var i = 0; i< alltwotes.length;i++){
    if (alltwotes[i]['author'] == authorname) {
      var object_old = alltwotes[i]
      object_old['button'] = true //true for key button if author matches the author of the tweet
      with_boolean.push(object_old)
    } else {
      var object_old = alltwotes[i]
      object_old['button'] = false //else false
      with_boolean.push(object_old)
    }
  }
  return with_boolean //return list of tweets
}

//Get all twotes and display for the twotes home
var twoteshome = function(req, res){

  var username = req.session.passport.user.displayName; //takes the username from the session

  //Counts whether or not that username is  in database
  User.count({author : username}, function (err, count){ 
    //IF NO USER HAS THAT NAME:
      if (count==0){
          var user = new User();
          user.author = username; //create new user and save

          user.save(function(err) {
            if (err) {
              res.sendStatus(500);
              return;
            }

            //Find all twotes that will be displayed on the bottom half of screen, sorted by date posted
            Twote.find({}).sort({'date_posted': 'desc'}).exec(function(err, twotes) {
              if (err) {
                res.sendStatus(500);
                return;
              }

              if (!twotes) {
                res.json({"error":"twotes not found"});
                return;
              }
              else {
                User.find({}, function(err,users) { //Find all users to display on the side
                  if (err) {
                    res.sendStatus(500);
                    return;
                  }

                  if (!users) {
                    res.json({"error":"users not found"});
                    return;
                  }
                  else {
                    //Render user, all the tweets and all users
                    res.render("twoteshome", {"username": user, "all_twotes" : twotes, "users_all" : users});
                    return;
                  }
                })
              }
            });
          })
        } else {

          //Pretty much do the same thing if there is already that user, except don't create and save the user
          User.find({author : username}, function(err, user) {
            if (err) {
              res.sendStatus(500);
              return;
            }

            Twote.find({}).sort({'date_posted': 'desc'}).exec(function(err, twotes) {
              if (err) {
                res.sendStatus(500);
                return;
              }

              if (!twotes) {
                res.json({"error":"twotes not found"});
                return;
              }
              else {
                User.find({}, function(err,users) {
                  if (err) {
                    res.sendStatus(500);
                    return;
                  }

                  if (!users) {
                    res.json({"error":"users not found"});
                    return;
                  }
                  else {
                    res.render("twoteshome", {"username": user, "all_twotes" : setBooleanTweets(user[0]["author"], twotes), "users_all" : users});
                    return;
                  }
                })
              }
            });
          })
        }
  }); 
};


//For the login home: get all twotes to show in the bottom half
var userhome = function(req,res) {

  Twote.find({}).sort({'date_posted': 'desc'}).exec(function(err, twotes) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (!twotes) {
      res.json({"error":"twotes not found"});
      return;
    }
    else {
      User.find({}, function(err,users) {
        if (err) {
          res.sendStatus(500);
          return;
        }

        if (!users) {
          res.json({"error":"users not found"});
          return;
        }
        else {
          res.render("home", {"all_twotes" : twotes, "users_all" : users});
          return;
        }
      })
    }
  });
}


//All of the export routes
module.exports.userhome = userhome;
module.exports.twoteshome = twoteshome;