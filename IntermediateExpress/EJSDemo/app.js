var express = require("express");
var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/fallinlovewith/:thing', function(req, res) {
  var thing = req.params.thing;
  res.render('love', {thingVar: thing});
});

app.get('/posts', function(req, res) {
  var posts = [
    {title: 'post 1', author: 'susy'},
    {title: 'post 2', author: 'not susy'},
    {title: 'post 3', author: 'other'},
  ];

  res.render('posts', {posts: posts});
});




app.listen(3000, process.env.IP, function() {
  console.log('server has started');
});
