var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app");

var catSchema = new mongoose.Schema({
  name: String,
  age: Number,
  temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

// var norris = new Cat({
//   name: "Mrs. Norris",
//   age: 7,
//   temperament: "Evil"
// });

// norris.save(function(err, cat) {
//   if(err) {
//     console.error("something went wrong", err);
//   } else {
//     console.log('cat saved');
//     console.log(cat);
//   }
// });

// Cat.create({
//   name: 'Snow White',
//   age: 15,
//   temperament: 'Bland'
// }, function(err, cat) {
//   if (err) {
//     console.error('error creating: ', err);
//   } else {
//     console.log(cat);
//   }
// });

Cat.find({}, function(err, cats) {
  if (err) {
    console.log('error: ', err);
  } else {
    console.log('all the cats:');
    console.log(cats);
  }
});