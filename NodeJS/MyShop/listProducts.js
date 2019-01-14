var faker = require('faker');

console.log("=".repeat(20));
console.log("WELCOME TO MY SHOP!");
console.log("=".repeat(20));

for (var i = 0; i < 10; i++) {
  console.log(faker.fake("{{commerce.productName}} - ${{commerce.price}}"));
};
