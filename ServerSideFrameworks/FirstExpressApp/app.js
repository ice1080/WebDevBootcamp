var express = require("express");
var app = express();

app.get("/", function(req, res) {
  res.send('hi there');
});

app.get('/bye', function(req, res) {
  res.send('goodbye');
});

app.get('/dog', function(req, res) {
  res.send('bark');
});

app.get('/r/:subredditName', function(req, res) {
  res.send('welcome to ' + req.params.subredditName);
});

app.get('*', function(req, res) {
  res.send('you are a star');
});



app.listen(3000, process.env.IP, function() {
  console.log('server has started');
});
