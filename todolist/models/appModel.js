var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todolist');

var todoSchema = mongoose.Schema({
	'todoitem' : String,
	'date_posted' : { type: Date, default: Date.now },
	'completed' : Boolean
});


module.exports = {
	'TodoModel' : mongoose.model('TodoModel', todoSchema)
};