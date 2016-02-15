var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/twotter');

var twoteSchema = mongoose.Schema({
	'author' : String,
	'author_id' : String,
	'date_posted' : { type: Date, default: Date.now },
	'text' : String,
	'deleted' : Boolean,
	'button' : Boolean
});

var userSchema = mongoose.Schema({
	'author' : String,
	'twotes' : [String]
})

module.exports = {
	'TwoteModel' : mongoose.model('TwoteModel', twoteSchema),
	'UserModel' : mongoose.model('UserModel', userSchema)
};