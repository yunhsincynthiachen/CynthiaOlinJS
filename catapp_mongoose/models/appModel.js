var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cats');

var catSchema = mongoose.Schema({
	'name' : String,
	'age' : { type: Number, min: 0, max: 100 },
	'color' : String
});

module.exports = mongoose.model('CatModel',catSchema);