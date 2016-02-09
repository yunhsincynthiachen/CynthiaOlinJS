var express = require('express');
var router = express.Router();

var Ingredient = require('../models/appModel.js').IngredientModel;
var Burger = require('../models/appModel.js').BurgerModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var async = require("async");

var home = function(req,res){
	res.render("home", {});
}

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


var ordershome = function(req, res){
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
	    	Burger.find({ }, function(err, burgers) {
			    if (err) {
			      res.sendStatus(500);
			      return;
			    }

			    if (!burgers) {
			      res.json({"error":"burgers not found"});
			      return;
			    }
			    else {

			    	var burgers_ing = []
					async.each(burgers, function(burger, callback) {
			    		Ingredient.find({
						    '_id': { $in: burger['ingredients']}
						}, function(err, docs){
						     burgers_ing.push({'name': burger['name'], 'iscomplete': burger['iscomplete'], '_id': burger._id, 'ingredients' : docs, 'totalprice':burger['totalprice']});
						     callback();
						});
					}, function(err){
					    // if any of the file processing produced an error, err would equal that error
					    if( err ) {
					      // One of the iterations produced an error.
					      // All processing will now stop.
					      	console.log('A file failed to process');
					    } else {
					     	res.render("orders",{"ingredient" : ingredient, "order": burgers_ing});
			    			return;
					    }
					});
			    }
		  	});
	    }
  	});
};

var kitchenhome = function(req,res) {
	Burger.find({ }, function(err, burgers) {
	    if (err) {
	      res.sendStatus(500);
	      return;
	    }

	    if (!burgers) {
	      res.json({"error":"burgers not found"});
	      return;
	    }
	    else {

	    	var burgers_ing = []
			async.each(burgers, function(burger, callback) {
	    		Ingredient.find({
				    '_id': { $in: burger['ingredients']}
				}, function(err, docs){
				     burgers_ing.push({'name': burger['name'], 'iscomplete': burger['iscomplete'], '_id': burger._id, 'ingredients' : docs, 'totalprice':burger['totalprice']});
				     callback();
				});
			}, function(err){
			    // if any of the file processing produced an error, err would equal that error
			    if( err ) {
			      // One of the iterations produced an error.
			      // All processing will now stop.
			      	console.log('A file failed to process');
			    } else {
			    	console.log(burgers_ing);
			     	res.render("kitchen",{"orders": burgers_ing});
	    			return;
			    }
			});
	    }
  	});
}

module.exports.home = home;
module.exports.kitchenhome = kitchenhome;
module.exports.ingredientshome = ingredientshome;
module.exports.ordershome = ordershome;