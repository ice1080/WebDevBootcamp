var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');



router.get('/new', middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.error('error: ', err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

router.post('/', middleware.isLoggedIn, function(req, res) {
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
          req.flash('success', 'Successfully created comment');
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
  });
});

router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err || !updatedComment) {
      req.flash('error', 'Comment not found');
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});




module.exports = router;



