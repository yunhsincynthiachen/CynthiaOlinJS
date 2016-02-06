var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

var index = require('./routes/index');

var ingredient = require('./routes/ingredient.js');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/ingredients', index.ingredientshome);
app.get('/ingredient/:divid', ingredient.getIngredientGET);
app.post('/ingredient', ingredient.getIngredientPOST);
app.delete('/ingredient/:divid', ingredient.getIngredientDELETE);
app.post('/ingredient/:divid', ingredient.getIngredientEDIT);

app.get('/order', index.order)


app.listen(3000);
