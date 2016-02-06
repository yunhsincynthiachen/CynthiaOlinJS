var express = require('express');
var router = express.Router();

var Robot = require('../models/robotModel.js');
var mongoose = require('mongoose');
var db = mongoose.connection;

var robots = function (req,res) {
  	Robot.find({}, function(err, robots){
  		res.render("robots",{"robots":robots});
	});
}

var addrobots = function (req,res){
	var robotModel = new Robot();

	robotModel.name = "Casey";
	robotModel.abilities = ["be awesome sometimes","tea"];
	robotModel.isEvil = true;

	robotModel.save(function(err) {
		if (err) {
		  res.sendStatus(500);
		  return;
		}
		res.sendStatus(200);
		return;
	})
}

var getCasey = function (req,res){
	Robot.find({"name": "Casey"}, function(err, robot){
		console.log(robot.toString());
		if (err) {
		  res.sendStatus(500);
		  return;
		}
		res.render("robots",{"robots":robot})
		return;
	})
}

module.exports.getCasey = getCasey;
module.exports.robots = robots;
module.exports.addrobots = addrobots;