var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');
var NodeGeocoder = require('node-geocoder');
var multer = require('multer');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
}
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'demnkhsew',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

router.get('/', function(req, res) {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({ "name": regex }, function(err, campgrounds) {
      if (err) {
        console.log('poo');
        console.error('error: ', err);
      } else {
        if (campgrounds.length < 1) {
          req.flash('error', 'No campgrounds found');
          return res.redirect('/campgrounds');
        }
        res.render('campgrounds/index', {campgrounds: campgrounds, page: 'campgrounds'});
      }
    });
  } else {
    Campground.find({}, function(err, campgrounds) {
      if (err) {
        console.error('error: ', err);
      } else {
        res.render('campgrounds/index', {campgrounds: campgrounds, page: 'campgrounds'});
      }
    });
  }
});

router.post('/', middleware.isLoggedIn, upload.single('image'), function(req, res) {
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      console.log(err);
      console.log(err.message);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url;
      req.body.campground.imageId = result.public_id;
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      }

      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
      // var newCampground = {name: name, price: price, image: imageUrl, description: desc, author: author, location: location, lat: lat, lng: lng};
      Campground.create(req.body.campground, function(err, newlyCreated) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + newlyCreated.id);
      });
    });
  });
});

router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

router.get('/:id', function(req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
    if (err || !foundCampground) {
      req.flash('error', 'Campground not found');
      res.redirect('back');
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render('campgrounds/edit', {campground: foundCampground});
  });
});

router.put('/:id', middleware.checkCampgroundOwnership, upload.single('image'), function(req, res) {
  geocoder.geocode(req.body.campground.location, function(err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    if (req.file) {
      Campground.findById(req.params.id, async function(err, campground) {

        try {
          await cloudinary.v2.uploader.destroy(campground.imageId);
          var result = await cloudinary.v2.uploader.upload(req.file.path);
          campground.imageId = result.public_id;
          campground.image = result.secure_url;
        } catch(err) {
          req.flash("error", err.message);
          return res.redirect('back');
        }
        campground.name = req.body.campground.name;
        campground.description = req.body.campground.description;
        campground.lat = data[0].latitude;
        campground.lng = data[0].longitude;
        campground.location = data[0].formattedAddress;
        campground.save();
        req.flash('success', 'Successfully updated');
        res.redirect('/campgrounds/' + campground._id);

      });
    } else {
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
          req.flash('error', err.message);
          res.redirect('back');
        } else {
          req.flash('success', 'Campground successfully updated');
          res.redirect('/campgrounds/' + req.params.id);
        }
      });
    }
  });
});

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id,  async function(err, campground) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    try {
      await cloudinary.v2.uploader.destroy(campground.imageId);
      campground.remove();
      req.flash('success', 'Campground successfully deleted');
      res.redirect('/campgrounds');
    } catch(err) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}



module.exports = router;

