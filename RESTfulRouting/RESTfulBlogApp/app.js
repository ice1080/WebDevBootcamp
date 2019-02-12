var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// App config
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose/Model config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//   title: 'Test Blog',
//   image: 'https://www.elastic.co/assets/bltada7771f270d08f6/enhanced-buzz-1492-1379411828-15.jpg',
//   body: 'yo stuff'
// });

// RESTful Routes

app.get('/', function(req, res) {
  res.redirect('/blogs');
})

// INDEX ROUTE
app.get('/blogs', function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.error('error: ', err);
    } else {
      res.render('index', {blogs: blogs});
    }
  });
});

// NEW ROUTE
app.get('/blogs/new', function(req, res) {
  res.render('new');
});

// CREATE ROUTE
app.post('/blogs', function(req, res) {
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  })
});


// SHOW ROUTE
app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('show', {blog: foundBlog});
    }
  });
});

app.listen(3000, process.env.IP, function() {
  console.log('server is running');
});
