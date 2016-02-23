var path = require('path');

var Ingredient = require('../models/appModel.js').IngredientModel;
var Burger = require('../models/appModel.js').BurgerModel;

var mongoose = require('mongoose');
var db = mongoose.connection;
// shouldn't need mongoose or db here if you've connected to the database in app.js --
// the Mongoose models are enough

var async = require("async");

var routes = {};

//Get the one burger information:
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

//Get all ingredients and total price of a burger:
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
    // don't need the else -- you returned in the if
		var burgers_ing = {}
		var burgers = []
		var tot_price = 0;
		async.each([burger], function(burger, callback) { // nice!
    		Ingredient.find({
			    '_id': { $in: burger['ingredients']}
		  }, function(err, docs){
				docs.forEach(function(entry) {
					tot_price = tot_price + entry['price'];
				  burgers.push(entry['name']);
				});

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
    /* If you wanted to update price without making a database query (and without a second
       ajax request in your success handler!) you could have sent the total price to the database
       when placing the order, along with all of the ingredients in the order.
       You're displaying prices on the place-an-order page next to the ingredient checkboxes, so you
       have enough information to figure out the total price of the order on the clientside.
    */
  });
};

//Create the order and save the burger data to the server:
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

//export these routes
module.exports = routes;
