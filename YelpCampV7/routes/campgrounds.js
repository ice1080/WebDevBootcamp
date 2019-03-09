var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');


router.get('/', function(req, res) {
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.error('error: ', err);
    } else {
      res.render('campgrounds/index', {campgrounds: campgrounds});
    }
  });
});

router.post('/', function(req, res) {
  var name = req.body.name;
  var imageUrl = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: imageUrl, description: desc};
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.error('error: ', err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

router.get('/new', function(req, res) {
  res.render('campgrounds/new');
});

router.get('/:id', function(req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
    if (err) {
      console.error('error: ', err);
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});





module.exports = router;

