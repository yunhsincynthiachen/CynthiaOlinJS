var path = require('path');

var Ingredient = require('../models/appModel.js').IngredientModel;
var Burger = require('../models/appModel.js').BurgerModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var async = require("async");

var routes = {};

routes.getOrderGET = function(req,res) {
	var data_id = req.params.orderid;

	Burger.findOne({ '_id' : data_id  }, function(err, burger) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (!burger) {
      res.json({"error":"burger not found"});
      return;
    }
    else {
      res.send(burger);
      return;
    }
  });
}

routes.getOrderIngredientsGET = function(req,res) {
	var data_id = req.params.orderid;

	Burger.findOne({ '_id' : data_id  }, function(err, burger) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (!burger) {
      res.json({"error":"burger not found"});
      return;
    }
    else {
		var burgers_ing = {}
		var burgers = []
		var tot_price = 0;
		async.each([burger], function(burger, callback) {
    		Ingredient.find({
			    '_id': { $in: burger['ingredients']}
			}, function(err, docs){
				docs.forEach(function(entry) {
					tot_price = tot_price + entry['price'];
				    burgers.push(entry['name']);
				});
				console.log(burgers)
				burgers_ing['list_ing'] = burgers;
				burgers_ing['totprice'] = tot_price;
			    callback();
			});
		}, function(err){
		    // if any of the file processing produced an error, err would equal that error
		    if( err ) {
		      // One of the iterations produced an error.
		      // All processing will now stop.
		      	console.log('A file failed to process');
		    } else {
		     	res.send(burgers_ing);
      			return;
		    }
		});
    }
  });
}


routes.getOrderPOST = function(req, res) {
  var b = req.body;

  var burger = new Burger();
  burger.name = b.name;
  burger.ingredients = b.ingredients;
  burger.totalprice = b.totalprice;
  burger.iscomplete = false;

  burger.save(function(err) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.send(burger);
    return;
  })
};

module.exports = routes;