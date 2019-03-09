var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');



router.get('/new', isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.error('error: ', err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

router.post('/', isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.error('error: ', err);
    } else {
      Comment.create(req.body.comment, function(err, newComment) {
        if (err) {
          console.error('error: ', err);
        } else {
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;

          newComment.save();
          campground.comments.push(newComment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});




function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}



module.exports = router;



