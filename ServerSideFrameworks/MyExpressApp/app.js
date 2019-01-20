var express = require("express");
var app = express();

app.get('/', function(req, res) {
  res.send('Hi there, welcome to my assignment!');
});

app.get('/speak/:animal', function(req, res) {
  var animal = req.params.animal.toLowerCase();
  if (animal == 'pig') {
    res.send("The pig says 'Oink'");
  } else if (animal == 'cow') {
    res.send("The cow says 'Moo'");
  } else if (animal == 'dog') {
    res.send("The dog says 'Woof Woof!'");
  } else {
    res.send("Unknown animal");
  }
});

app.get('/repeat/:str/:num', function(req, res) {
  var str = req.params.str;
  var num = Number(req.params.num);
  var output = '';
  for (var i = 0; i < num; i++) {
    output += str + ' ';
  }
  res.send(output);
});

app.get('*', function(req, res) {
  res.send('Sorry, page not found...What are you doing with your life?');
});





app.listen(3000, process.env.IP, function() {
  console.log('server has started');
});
