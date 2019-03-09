var express        = require("express"),
    app            = express(),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    LocalStrategry = require('passport-local'),
    Campground     = require('./models/campground'),
    Comment        = require('./models/comment'),
    User           = require('./models/user'),
    seedDb         = require('./seeds');

mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
seedDb();

app.use(require('express-session')({
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategry(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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



// Auth Routes
app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  var newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/campgrounds');
    });
  });
});


app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/campgrounds', 
    failureRedirect: '/login'
  }), function(req, res) {

});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/campgrounds');
});






app.listen(3000, process.env.IP, function() {
  console.log('Yelp Camp server has started');
});
