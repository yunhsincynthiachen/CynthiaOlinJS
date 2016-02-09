var path = require('path');

var Ingredient = require('../models/appModel.js').IngredientModel;
var Burger = require('../models/appModel.js').BurgerModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var async = require("async");

var routes = {};

routes.completeOrder = function(req,res) {
  var orderid = req.params.orderid;
  var b = req.body;

  Burger.findOne({ '_id' : orderid  }, function(err, burger) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (!burger) {
      res.json({"error":"burger not found"});
      return;
    }
    else {
    	burger['iscomplete'] = true;
      burger.save(function(err) {
        if (err) {
          res.sendStatus(500);
          return;
        }

        res.send(burger);
        return;
      })
    }
  });
}

module.exports = routes;