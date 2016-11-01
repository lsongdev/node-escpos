const SerialPort   = require('serialport');

function Serial(port, baudrate){
  baudrate = baudrate || 9600;
  this.port = new SerialPort(port, { 
    autoOpen: false,
    baudrate: baudrate
  });
};

Serial.prototype.open = function(callback){
  this.port.open(callback);
  return this;
};
Serial.prototype.write = function(buf, callback){
  this.port.write(buf, callback);
  return this;
};

module.exports = Serial;
