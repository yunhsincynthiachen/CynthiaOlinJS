var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var login = require('./routes/login.js');
var twotes = require('./routes/twotes.js');

var app = express();

var auth = require('./auth');

var password = require("./password")(passport);


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


// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

//When app is opened, if there is a sess.username, redirect to twotes, else login
app.get("/", function(req, res){
  var sess = req.session;
  console.log(sess);
  if (!sess.username) {
    res.redirect("/login");
  } else {
    res.redirect("/twotes");
  }
});

// process the login form for local, but I don't have this working yet
app.post('/login_local', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("WAT")
    res.redirect('/twotes');
  });

//GET Requests for Facebook LogIn
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/twotes',
                                      failureRedirect: '/login' })
);

//Logout of Facebook
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});


//Routes for login and main page
app.get("/login", index.userhome);
app.post("/createuser", login.createUser);
app.get("/twotes", ensureAuthenticated,index.twoteshome);
app.post("/createtwote/:userid", twotes.createTwote);
app.delete("/deleteTwote/:userid/:tweetid", twotes.deleteTwote);


app.listen(3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
    res.send(401);
}