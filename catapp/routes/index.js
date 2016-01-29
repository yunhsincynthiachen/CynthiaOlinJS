var express = require('express');
var router = express.Router();
var db = require('../fakeDatabase');

//Cat Object
function Cat(name,age,color){
  var cat = {
    name: name,
    age: age,
    color:color
  };
  return cat;
}

//Counts and displays number of cats on the home page
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

//Sorts cats by age and displays on allcats page
var allcats = function(req, res){
	var all_cats = db.getAll();
	all_cats.sort(function(a, b) {
    	return parseFloat(a.age) - parseFloat(b.age);
	});

	if (all_cats.length > 0) {
		var context = "All of the Cats!"
	}
	else{
		var context = "There are No Cats!"
	}
	res.render("allcats", {"cats":all_cats, "context": context});
};

//Makes a random cat and displays the cat info, as well as adds it into the database
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

//Only grabs cats with the certain color and then displays the color and the cats
var sortcolor = function(req,res) {
	var all_cats = db.getAll();

	var color = req.params.color;

	var new_cats_array = [];

	if (color == "nocolor") {
		var color = "You Did Not Search a Color"
	} else {
		for (var i = 0; i<all_cats.length;i++){
			if (all_cats[i]['color'] == color){
				new_cats_array.push(all_cats[i]);
			}
		}
		var color = "All of the Cats by " + color;
	}

	res.render("sortcolor", {"color":color, "cats":new_cats_array});
}

//Deletes oldest cat
var deleteold = function(req,res) {
	var all_cats = db.getAll();;
	var new_cats_array = [];

	//Array of cat ages:
	for (var i = 0; i<all_cats.length;i++){
		new_cats_array.push(all_cats[i]['age']);
	}

	//Finds the index of where the cat age is the oldest:
	var i = new_cats_array.indexOf(Math.max.apply(Math, new_cats_array));

	//Removes cat from database or reveals that there are no cats left
	if (all_cats.length > 0){
		var max_cats = all_cats[i];
		max_cats["context"] = "OLDEST CAT DELETED!";
		db.remove(i);
	} else {
		var max_cats = {"name":"No Cat","age":"No Age","color":"No Color"};
		max_cats["context"] = "No More Cats to Delete!";
	}


	res.render("deleteold", max_cats)
}

module.exports.home = home;
module.exports.allcats = allcats;
module.exports.newcat = newcat;
module.exports.sortcolor = sortcolor;
module.exports.deleteold = deleteold;