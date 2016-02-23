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
    res.send(ingredient);
    return;
  })
};

//Delete an ingredient
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

//Change an ingredient's information
routes.getIngredientEDIT = function(req,res) {
  // I wouldn't give these variables new names -- takes up space you don't need to take up
  var divid = req.params.divid;
  var b = req.body;

  Ingredient.findOne({ '_id' : divid  }, function(err, ingredient) {
    if (err) {
      return res.sendStatus(500); // you can put return on the same line, if you'd like
      // Nice error handling, and I like that you're using return to manage your
      // control flow -- much cleaner than tons of nested if/else statements.
    }

    if (!ingredient) {
      res.json({"error":"ingredient not found"});
      return;
    } else { // you don't even need this else -- you returned in the if
      //For all of the keys given, check if they are empty, if not change the ingredient to have that info, and save
      for(var key in b) { // ...if you are going to give req.params.divid and req.body new names, be consistent about using them
        if(b.hasOwnProperty(key)){
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
      });
    }
  });
}; // defined as a method on an object, so you need a semicolon

module.exports = routes;
