

function Vehicle(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.isRunning = false;
}

Vehicle.prototype.turnOn = function() {
  this.isRunning = true;
}

Vehicle.prototype.turnOff = function() {
  this.isRunning = false;
}

Vehicle.prototype.honk = function() {
  if (this.isRunning) {
    return 'beep';
  } else {
    return '';
  }
}

var superleggera = new Vehicle('ducati', 'superleggera', '2019');



console.log(superleggera.honk());

superleggera.turnOn();

console.log(superleggera.honk());

superleggera.turnOff();

console.log(superleggera.honk());
