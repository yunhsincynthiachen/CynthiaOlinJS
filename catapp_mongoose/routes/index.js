var express = require('express');
var router = express.Router();

var Cat = require('../models/appModel.js');
var mongoose = require('mongoose');
var db = mongoose.connection;


//Counts and displays number of cats on the home page
var home = function(req,res){
	//Gets all of the cats and then counts how many there are
	Cat.count({}, function( err, count){
    	if (count == 0) {
			res.render("home",{"context": "No Cats. Add More!"})
		} else {
			res.render("home",{"context": "You have " + count +" cats!"})
		}
	})
}

// Sorts cats by age and displays on allcats page
var allcats = function(req, res){

	Cat.find({}).sort('age').exec(function (err,cats_sorted_age){
		if (err) {
			res.sendStatus(500);
			return;
	    }

	    //The array of sorted cats will be displayed on the allcats page
	    if (!cats_sorted_age) {
			res.json({"error":"Cats not found"});
			return;
	    } else {
	    	//Checks that there are cats in the list
			if (cats_sorted_age.length > 0) {
				var context = "All of the Cats!"
			}
			else{
				var context = "There are No Cats!"
			}
			res.render("allcats", {"cats":cats_sorted_age, "context": context});
	    	return;
	    }
	})
};

//Makes a random cat and displays the cat info, as well as adds it into the database
var newcat = function(req,res){
	//Array of Possible Cat Names
	var myArray_cat = ["Mika", "Zoher","Jay","Cynthia","Nitya","Sarah","Emily Engel","Olivia","Meredith","Jean","Chris","Curtis","Brad","Hugh Jackman","Michael Fassbender","Leonardo DiCaprio"];
	var rand_cat = myArray_cat[Math.floor(Math.random() * myArray_cat.length)]; //randomnly choose name

	var rand_age = Math.floor(Math.random() * (100 - 0 + 1)) + 0; //randomnly choose age

	//Array of Possible Colors
	var myArray_color = ["Black","Purple","Brown","Magenta","White","Yellow","All Colors","Blue","Orange","Green","Teal","Red"];
	var rand_color = myArray_color[Math.floor(Math.random() * myArray_color.length)]; //randomnly choose color

	//Create a New Cat and Save Model:
	var CatModel = new Cat();

	//Setting the properties of the new cat model
	CatModel.name = rand_cat;
	CatModel.age = rand_age;
	CatModel.color = rand_color;

	CatModel.save(function(err) { //saving the model
		if (err) {
		  res.sendStatus(500);
		  return;
		}
		res.render("newcat",CatModel); //sends new catmodel to be displayed
		return;
	})
};

//Only grabs cats with the certain color and then displays the color and the cats
var filtercolor = function(req,res) {
	//Finds cats that are of a particular color
	var searched_color = req.params.color;
	Cat.find({"color": searched_color}).sort('age').exec(function (err,cats_color){
		if (err) {
			res.sendStatus(500);
			return;
	    }

	    if (!cats_color) {
			return;
	    } else {
	    	//If no color was searched, the render will be different:
	    	if (searched_color != "nocolor") {
		    	var color = "All of the Cats by " + searched_color;

				res.render("sortcolor", {"color":color, "cats":cats_color});
		    	return;
		    } else {
		    	var color = "You Did Not Search a Color"
				res.render("sortcolor", {"color":color, "cats":cats_color});
		    }
	    }
	})
}

//Deletes oldest cat
var deleteold = function(req,res) {
	//Sorts all cats by age and then finds the max cat, which will be removed
	//from the model
	Cat.findOne({ }).sort("-age").exec( function(err, cat) {
	     var max = cat._id;

	     //Takes the id of the max cat and removes from db collection
	     Cat.remove({"_id": max}, function(err,removed){
	     	if (err) {
				res.sendStatus(500);
				return;
		    }
		    //If no error, oldest cat will be displayed
		    res.render("deleteold", cat)
		    return;
	     })
	});
}

//Gets All Cats in an Age Range
var agerange = function(req,res) {
	//If there is an age range specified, we will get max and min and 
	if (req.params.range != "noage") {
		var range_age = (req.params.range).split("-");

		var min = range_age[0];
		var max = range_age[1];

		//Find cats that meet the age range and sorts by age
		Cat.find({"age": {$gte: min, $lte: max}}).sort('age').exec(function (err,range_cats){
			if (err) {
				res.sendStatus(500);
				return;
		    }

		    if (!range_cats) {
				return;
		    } else {
		    	//Render the age range and the cats that fit the criteria
		    	var range = "All of the Cats in Range of " + min + " to " + max;

				res.render("agerange", {"age":range, "cats":range_cats});
		    	return;
		    }
		})	
	} else {
		//If no age was searched, the render will be different:
		res.render("agerange", {"age":"No Age Specified", "cats":""});
	}
}
//All of the different module exports
module.exports.home = home;
module.exports.allcats = allcats;
module.exports.newcat = newcat;
module.exports.filtercolor = filtercolor;
module.exports.deleteold = deleteold;
module.exports.agerange = agerange;