const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

module.exports = function() {
  passport.use('local', new LocalStrategy(
    { usernameField: 'email' },
    function(email, password, done) {
      User.findByEmail(email, (err, user) => {
        if(err) {
          return done(err);
        }
        if(!Boolean(user)) {
          return done(null, false);
        }
        User.validPassword(password, user.password, (err, isMatch) => {
          if(err) {
            return done(err);
          }
          if(!isMatch) {
            return done(null, false);
          }
          return done(null, user);
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

}