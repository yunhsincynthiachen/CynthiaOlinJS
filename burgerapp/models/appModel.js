var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/burgers');

var ingredientSchema = mongoose.Schema({
	'name' : String,
	'price' : { type: Number, min: 0, max: 100 },
	'quantity' : { type: Number, min: 0, max: 1000 },
	'outofstock' : String
});

var burgerSchema = mongoose.Schema({
	'ingredients' : [String]
})

module.exports = {
	'IngredientModel' : mongoose.model('IngredientModel', ingredientSchema),
	'BurgerModel' : mongoose.model('BurgerModel', burgerSchema)
};