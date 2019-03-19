var express        = require("express"),
    app            = express(),
    bodyParser     = require('body-parser'),
    flash          = require('connect-flash'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    LocalStrategry = require('passport-local'),
    methodOverride = require('method-override'),
    User           = require('./models/user'),
    seedDb         = require('./seeds');

var commentRoutes     = require('./routes/comments'),
    campgroundRoutes  = require('./routes/campgrounds'),
    indexRoutes        = require('./routes/index');

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// seedDb(); // seed the database

app.use(require('express-session')({
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.locals.moment = require('moment');
passport.use(new LocalStrategry(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});


app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);



app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Yelp Camp server has started');
});


