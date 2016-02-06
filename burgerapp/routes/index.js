var express = require('express');
var router = express.Router();

var Ingredient = require('../models/appModel.js').IngredientModel;
var Burger = require('../models/appModel.js').BurgerModel;

var mongoose = require('mongoose');
var db = mongoose.connection;


var ingredientshome = function(req, res){
	Ingredient.find({ }, function(err, ingredient) {
	    if (err) {
	      res.sendStatus(500);
	      return;
	    }

	    if (!ingredient) {
	      res.json({"error":"ingredient not found"});
	      return;
	    }
	    else {
	      res.render("ingredients",{"oldingredient":ingredient});
	      return;
	    }
  	});
};

var order = function(req, res){
	Ingredient.find({ }, function(err, ingredient) {
	    if (err) {
	      res.sendStatus(500);
	      return;
	    }

	    if (!ingredient) {
	      res.json({"error":"ingredient not found"});
	      return;
	    }
	    else {
	      res.render("order",{"ingredient":ingredient});
	      return;
	    }
  	});
};

module.exports.ingredientshome = ingredientshome;
module.exports.order = order;