var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

var index = require('./routes/index');

var ingredient = require('./routes/ingredient.js');

var order = require('./routes/order.js');

var kitchen = require('./routes/kitchen.js');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.home); //home route

//all ingredients routes:
app.get('/ingredients', index.ingredientshome);
app.get('/ingredient/:divid', ingredient.getIngredientGET);
app.post('/ingredient', ingredient.getIngredientPOST);
app.delete('/ingredient/:divid', ingredient.getIngredientDELETE);
app.post('/ingredient/:divid', ingredient.getIngredientEDIT);

//all order routes:
app.get('/orders', index.ordershome);
app.post('/order', order.getOrderPOST);
app.get('/order/:orderid', order.getOrderGET);
app.get('/orderingredients/:orderid', order.getOrderIngredientsGET);

//all kitchen routes:
app.get('/kitchen', index.kitchenhome);
app.post('/completeorder/:orderid', kitchen.completeOrder);

app.listen(3000);
