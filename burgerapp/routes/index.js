var express = require('express');
var router = express.Router();

var Ingredient = require('../models/appModel.js').IngredientModel;
var Burger = require('../models/appModel.js').BurgerModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var async = require("async");

//home of the webpage will not need any data rendered. Everything is in the handlebar
var home = function(req,res){
	res.render("home", {});
}

//ingredients page: show all of the ingredients that are in the database already:
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

//ordershome, we need all of the ingredients, burgers (with their ingredients and total price)
var ordershome = function(req, res){
	//Getting all ingredients
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
			    	//Getting all burgers and their ingredients, using an asynchronous way:
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
					    	//render all of the information
					     	res.render("orders",{"ingredient" : ingredient, "order": burgers_ing});
			    			return;
					    }
					});
			    }
		  	});
	    }
  	});
};

//Kitchen home needs all of the burgers and whether they are completed yet
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
			     	res.render("kitchen",{"orders": burgers_ing});
	    			return;
			    }
			});
	    }
  	});
}

//All of the export routes
module.exports.home = home;
module.exports.kitchenhome = kitchenhome;
module.exports.ingredientshome = ingredientshome;
module.exports.ordershome = ordershome;