var mongoose = require('mongoose');

var mongoUri = process.env.PROD_MONGODB ||
  'mongodb://localhost/burgers';
mongoose.connect(mongoUri);

var ingredientSchema = mongoose.Schema({
	'name' : String,
	'price' : { type: Number, min: 0, max: 100 },
	'quantity' : { type: Number, min: 0, max: 1000 },
	'outofstock' : Boolean
});

var burgerSchema = mongoose.Schema({
	'name' : String,
	'totalprice' : { type: Number, min: 0, max: 1000 },
	'ingredients' : [String],
	'iscomplete' : Boolean
})

module.exports = {
	'IngredientModel' : mongoose.model('IngredientModel', ingredientSchema),
	'BurgerModel' : mongoose.model('BurgerModel', burgerSchema)
};