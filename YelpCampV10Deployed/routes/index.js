var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Campground = require('../models/campground');





router.get('/', function(req, res) {
  res.render('landing');
});

// Auth Routes
router.get('/register', function(req, res) {
  res.render('register', {page: 'register'});
});

router.post('/register', function(req, res) {
  var newUser = new User({
    username: req.body.username, 
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar
  });
  if (req.body.adminCode == process.env.SECRET_ADMIN_CODE) {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('register');
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Welcome to YelpCamp ' + user.username);
      res.redirect('/campgrounds');
    });
  });
});

router.get('/users/:id', function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err || !foundUser) {
      req.flash('error', 'Something went wrong.');
      res.redirect('/');
    } else {
      Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
        if (err) {
          req.flash('error', 'Something went wrong.');
          res.redirect('/');
        } else {
          res.render('users/show', {user: foundUser, campgrounds: campgrounds});
        }
      });
    }
  });
});

router.get('/login', function(req, res) {
  res.render('login', {page: 'login'});
});

router.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/campgrounds', 
    failureRedirect: '/login'
  }), function(req, res) {

});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Logged you out');
  res.redirect('/campgrounds');
});






module.exports = router;



