var express = require('express');
var router = express.Router();

var Twote = require('../models/appModel.js').TwoteModel;
var User = require('../models/appModel.js').UserModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var async = require("async");

// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');
// Load the fp build for immutable auto-curried iteratee-first data-last methods.
var _ = require('lodash/fp');

// Load a method category.
var array = require('lodash/array');
var object = require('lodash/fp/object');

// Load a single method for smaller builds with browserify/rollup/webpack.
var chunk = require('lodash/chunk');
var extend = require('lodash/fp/extend');


var setBooleanTweets = function (authorname, alltwotes){
  var with_boolean = new Array();
  console.log(authorname);
  for (var i = 0; i< alltwotes.length;i++){
    if (alltwotes[i]['author'] == authorname) {
      var object_old = alltwotes[i]
      object_old['button'] = true
      with_boolean.push(object_old)
    } else {
      var object_old = alltwotes[i]
      object_old['button'] = false
      with_boolean.push(object_old)
    }
  }
  console.log(with_boolean.toString())
  return with_boolean
}

//Get all twotes
var twoteshome = function(req, res){

  console.log(req.session.passport.user.displayName)
  var username = req.session.passport.user.displayName;

  User.count({author : username}, function (err, count){ 
      if (count==0){
          var user = new User();
          user.author = username;

          user.save(function(err) {
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
                console.log(user.toString())
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
                    res.render("twoteshome", {"username": user, "all_twotes" : twotes, "users_all" : users});
                    return;
                  }
                })
              }
            });
          })
        } else {
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