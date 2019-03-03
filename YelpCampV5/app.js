var express     = require("express"),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    seedDb      = require('./seeds');

mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
seedDb();

// Campground.create(
//   {
//     name: 'Granite Hill',
//     image: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg',
//     description: 'stuff and things'
//   },
//   function(err, campground) {
//     if (err) {
//       console.error('error: ', err);
//     } else {
//       console.log(campground);
//     }
// });

// console.log(Campground.find());

app.get('/', function(req, res) {
  res.render('landing');
});

app.get('/campgrounds', function(req, res) {
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.error('error: ', err);
    } else {
      res.render('campgrounds/index', {campgrounds: campgrounds});
    }
  });
});

app.post('/campgrounds', function(req, res) {
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

app.get('/campgrounds/new', function(req, res) {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', function(req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
    if (err) {
      console.error('error: ', err);
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
})


// ========================
// COMMENTS ROUTES
// ========================

app.get('/campgrounds/:id/comments/new', function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.error('error: ', err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.error('error: ', err);
    } else {
      Comment.create(req.body.comment, function(err, newComment) {
        if (err) {
          console.error('error: ', err);
        } else {
          campground.comments.push(newComment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});








app.listen(3000, process.env.IP, function() {
  console.log('Yelp Camp server has started');
});
