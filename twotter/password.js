// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var Twote = require('./models/appModel.js').TwoteModel;
var User = require('./models/appModel.js').UserModel;

// load the auth variables
var auth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
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

    // // =========================================================================
    // // LOCAL SIGNUP ============================================================
    // // =========================================================================
    // passport.use('local-signup', new LocalStrategy({
    //     // by default, local strategy uses username and password, we will override with email
    //     usernameField : 'email',
    //     passwordField : 'password',
    //     passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    // },
    // function(req, email, password, done) {

    //     // asynchronous
    //     process.nextTick(function() {

    //         //  Whether we're signing up or connecting an account, we'll need
    //         //  to know if the email address is in use.
    //         User.findOne({'local.email': email}, function(err, existingUser) {

    //             // if there are any errors, return the error
    //             if (err)
    //                 return done(err);

    //             // check to see if there's already a user with that email
    //             if (existingUser) 
    //                 return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

    //             //  If we're logged in, we're connecting a new local account.
    //             if(req.user) {
    //                 var user            = req.user;
    //                 user.local.email    = email;
    //                 user.local.password = user.generateHash(password);
    //                 user.save(function(err) {
    //                     if (err)
    //                         throw err;
    //                     return done(null, user);
    //                 });
    //             } 
    //             //  We're not logged in, so we're creating a brand new user.
    //             else {
    //                 // create the user
    //                 var newUser            = new User();

    //                 newUser.local.email    = email;
    //                 newUser.local.password = newUser.generateHash(password);

    //                 newUser.save(function(err) {
    //                     if (err)
    //                         throw err;

    //                     return done(null, newUser);
    //                 });
    //             }

    //         });
    //     });

    // }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
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