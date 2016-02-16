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


// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

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

// process the login form
app.post('/login_local', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("WAT")
    res.redirect('/twotes');
  });

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ author: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/twotes',
                                      failureRedirect: '/login' })
);


app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

// app.get('/login_local', function(req, res) {
//   res.render('login.ejs', { message: req.flash('loginMessage') });
// });



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