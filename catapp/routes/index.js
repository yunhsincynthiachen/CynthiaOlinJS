var express = require('express');
var router = express.Router();
var db = require('../fakeDatabase');

function Cat(name,age,color){
  var cat = {
    name: name,
    age: age,
    color:color
  };
  return cat;
}

var home = function(req,res){
	var num_cats = db.getAll().length;
	if (num_cats == 0) {
		res.render("home",{"context": "No Cats. Add More!"})
	} else {
		console.log(num_cats)
		res.render("home",{"context": "You have " + num_cats +" cats!"})
	}
	console.log(num_cats);
}

var allcats = function(req, res){
	var all_cats = db.getAll();
	all_cats.sort(function(a, b) {
    	return parseFloat(a.age) - parseFloat(b.age);
	});
	// console.log(all_cats);

	if (all_cats.length > 0) {
		var context = "All of the Cats!"
	}
	else{
		var context = "There are No Cats!"
	}
	res.render("allcats", {"cats":all_cats, "context": context});
};

var newcat = function(req,res){
	var myArray_cat = ["Mika", "Zoher","Jay","Cynthia","Nitya","Sarah","Emily Engel","Olivia","Meredith","Jean","Chris","Curtis","Brad","Hugh Jackman","Michael Fassbender","Leonardo DiCaprio"];
	var rand_cat = myArray_cat[Math.floor(Math.random() * myArray_cat.length)];

	var rand_age = Math.floor(Math.random() * (100 - 0 + 1)) + 0;

	var myArray_color = ["Black","Purple","Brown","Magenta","White","Yellow","All Colors","Blue","Orange","Green","Teal","Red"];
	var rand_color = myArray_color[Math.floor(Math.random() * myArray_color.length)];

	var new_cat = Cat(rand_cat,rand_age,rand_color);
	res.render("newcat",new_cat);

	db.add(Cat(rand_cat,rand_age,rand_color));
};

var sortcolor = function(req,res) {
	var all_cats = db.getAll();

	var color = req.params.color;

	var new_cats_array = [];

	for (var i = 0; i<all_cats.length;i++){
		if (all_cats[i]['color'] == color){
			new_cats_array.push(all_cats[i]);
		}
	}

	res.render("sortcolor", {"color":color, "cats":new_cats_array});
}

var deleteold = function(req,res) {
	var all_cats = db.getAll();;
	var new_cats_array = [];
	for (var i = 0; i<all_cats.length;i++){
		new_cats_array.push(all_cats[i]['age']);
	}

	var i = new_cats_array.indexOf(Math.max.apply(Math, new_cats_array));


	if (all_cats.length > 0){
		var max_cats = all_cats[i];
		db.remove(i);
	} else {
		max_cats["context"] = "There are No More Cats!";
	}


	res.render("deleteold", max_cats)
}

module.exports.home = home;
module.exports.allcats = allcats;
module.exports.newcat = newcat;
module.exports.sortcolor = sortcolor;
module.exports.deleteold = deleteold;