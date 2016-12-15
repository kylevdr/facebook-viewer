const express = require('express'),
      session = require('express-session'),
      passport = require('passport'),
      FacebookStrategy = require('passport-facebook'),
      secrets = require('./secrets');

const app = express();

app.use(session({
  secret: secrets.sessionSecret,
  saveUninitialized: false,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: secrets.clientID,
  clientSecret: secrets.clientSecret,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook'), (req, res) => {
    res.status(200).redirect('/#/');
  });
app.get('/me', (req, res, next) => {
  res.status(200).send(req.user);
});
