var path = require('path');

var Ingredient = require('../models/appModel.js').IngredientModel;
var Burger = require('../models/appModel.js').BurgerModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var routes = {};


routes.getIngredientGET = function(req, res) {
  var divid = req.params.divid;

  Ingredient.findOne({ '_id' : divid  }, function(err, ingredient) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (!ingredient) {
      res.json({"error":"ingredient not found"});
      return;
    }
    else {
      res.send(ingredient);
      return;
    }
  });
};

routes.getIngredientPOST = function(req, res) {
  var b = req.body;

  var ingredient = new Ingredient();
  ingredient.name = b.name;
  ingredient.price = parseInt(b.price);
  ingredient.quantity = 1;
  ingredient.outofstock = "InStock";

  ingredient.save(function(err) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.send(ingredient);
    return;
  })
};

routes.getIngredientDELETE = function(req,res) {
  var divid = req.params.divid;
  Ingredient.remove({ '_id' : divid  }, function(err, removed) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.send(divid);
  });
}

routes.getIngredientEDIT = function(req,res) {
  var divid = req.params.divid;
  var b = req.body;

  Ingredient.findOne({ '_id' : divid  }, function(err, ingredient) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (!ingredient) {
      res.json({"error":"ingredient not found"});
      return;
    }
    else {
      for(var key in req.body) {
        if(req.body.hasOwnProperty(key)){
          if (b[key] != ""){
            ingredient[key] = b[key]
          }
        }
      }
      ingredient.save(function(err) {
        if (err) {
          res.sendStatus(500);
          return;
        }

        res.send(ingredient);
        return;
      })
    }
  });
}

module.exports = routes;