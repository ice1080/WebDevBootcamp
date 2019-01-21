var express = require("express");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


var campgrounds = [
  {name: 'Salmon Creek', image: 'https://static.toiimg.com/thumb/58475411/Kolkata-in-pictures.jpg?width=748&height=499'},
  {name: 'Granite Hill', image: 'https://static-news.moneycontrol.com/static-mcnews/2018/08/Germany.jpg'},
  {name: 'Mountain Goat\'s Rest', image: 'https://secure.i.telegraph.co.uk/multimedia/archive/03597/POTD_chick_3597497k.jpg'}
];


app.get('/', function(req, res) {
  res.render('landing');
});

app.get('/campgrounds', function(req, res) {
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', function(req, res) {
  var name = req.body.name;
  var imageUrl = req.body.image;
  var newCampground = {name: name, image: imageUrl};
  campgrounds.push(newCampground);
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res) {
  res.render('new.ejs');
});

app.listen(3000, process.env.IP, function() {
  console.log('Yelp Camp server has started');
});
