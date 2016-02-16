// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var Twote = require('./models/appModel.js').TwoteModel;
var User = require('./models/appModel.js').UserModel;

// load the auth variables
var auth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    //passport session setup

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });


    //LOCAL LOGIN
    // passport.use('local-login', new LocalStrategy({
    //     // by default, local strategy uses username and password, we will override with email
    //     usernameField : 'lg_username',
    //     passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    // },
    // function(req, username, done) {
    //     console.log(username)
    //     // asynchronous
    //     process.nextTick(function() {
    //         User.findOne({ 'author' :  username }, function(err, user) {
    //             console.log(user)
    //             // if there are any errors, return the error
    //             if (err)
    //                 return done(err);


    //             // all is well, return user
    //             else
    //             return done(null, user);
    //         });
    //     });

    // }));

    passport.use(new LocalStrategy(function(username, password, done) {
      process.nextTick(function() {
        User.findOne({
          'author': username, 
        }, function(err, user) {
          if (err) {
            return done(err);
          }

          if (!user) {
            return done(null, false);
          }

          if (user.password != password) {
            return done(null, false);
          }

          return done(null, user);
        });
      });
    }));

    //SIGN UP NOT DONE

    //FACEBOOK
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
};