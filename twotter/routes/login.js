var path = require('path');

var Twote = require('../models/appModel.js').TwoteModel;
var User = require('../models/appModel.js').UserModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var routes = {};


//Add a new user
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

// //Delete an ingredient
// routes.getIngredientDELETE = function(req,res) {
//   var divid = req.params.divid;
//   Ingredient.remove({ '_id' : divid  }, function(err, removed) {
//     if (err) {
//       res.sendStatus(500);
//       return;
//     }
//     res.send(divid);
//   });
// }


module.exports = routes;