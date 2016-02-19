var path = require('path');

var Ingredient = require('../models/appModel.js').IngredientModel;
var Burger = require('../models/appModel.js').BurgerModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var routes = {};

//Get one ingredient, with the id information
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

//Add a new ingredient
routes.getIngredientPOST = function(req, res) {
  var b = req.body;

  var ingredient = new Ingredient();
  ingredient.name = b.name;
  ingredient.price = parseInt(b.price);
  ingredient.quantity = 1;
  ingredient.outofstock = false;

  ingredient.save(function(err) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.status(200).send(ingredient);
    return;
  });
};

//Delete an ingredient
routes.getIngredientDELETE = function(req,res) {
  var name = req.params.name;
  Ingredient.remove({ 'name' : name  }, function(err, removed) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.status(200).send(name);
  });
};

//Change an ingredient's information
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
      //For all of the keys given, check if they are empty, if not change the ingredient to have that info, and save
      for(var key in req.body) {
        if(req.body.hasOwnProperty(key)){
          if (b[key] !== ""){
            ingredient[key] = b[key];
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
      });
    }
  });
};

module.exports = routes;