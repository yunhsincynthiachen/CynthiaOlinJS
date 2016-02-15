var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var index = require('./routes/index');
var login = require('./routes/login.js');
var twotes = require('./routes/twotes.js');

var app = express();

var auth = require('./auth');

passport.use(new FacebookStrategy({
    clientID: auth.FACEBOOK_APP_ID,
    clientSecret: auth.FACEBOOK_APP_SECRET,
    callbackURL: auth.FACEBOOK_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    //This is not what you want to do here. 
    //Here you should search the connected DB if the user exists and load that in, or add it to db.
    done(null, profile);
  }
));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({ secret: 'this is not a secret ;)',
  cookie:{},
  resave: false,
  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// app.get('/', index.twoteshome); //home route
app.get("/", function(req, res){
  var sess = req.session;
  console.log(sess);
  if (!sess.username) {
    res.redirect("/login");
  } else {
    res.redirect("/twotes");
  }
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/twotes',
                                      failureRedirect: '/login' })
);

app.get('/user', ensureAuthenticated, function(req, res) {
  res.send(req.user);
})



app.get("/login", index.userhome);
app.post("/createuser", login.createUser);
app.get("/twotes", ensureAuthenticated,index.twoteshome);
app.post("/createtwote/:userid", twotes.createTwote);
app.delete("/deleteTwote/:divid", twotes.deleteTwote);

//all ingredients routes:
// app.get('/ingredients', index.ingredientshome);
// app.get('/ingredient/:divid', ingredient.getIngredientGET);
// app.post('/ingredient', ingredient.getIngredientPOST);
// app.delete('/ingredient/:divid', ingredient.getIngredientDELETE);

app.listen(3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
    res.send(401);
}