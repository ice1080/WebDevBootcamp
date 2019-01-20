const request = require('request');

// let url = 'http://www.google.com';
let url = 'https://jsonplaceholder.typicode.com/users/1'
request(url, function(error, response, body) {
  // eval(require('locus'))
  if (!error && response.statusCode == 200) {
    let parsedData = JSON.parse(body);
    console.log(`${parsedData.name} lives in ${parsedData.address.city}`);
  }
});
