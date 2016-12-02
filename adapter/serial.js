'use strict';
const SerialPort = require('serialport');
const Adapter    = require('../adapter');

/**
 * SerialPort device
 * @param {[type]} port
 * @param {[type]} options
 */
function Serial(port, options){
  var self = this;
  options = options || { 
    baudrate: 9600,
    autoOpen: false
  };
  this.device = new SerialPort(port, options);
  this.device.on('close', function() {
    self.emit('disconnect', self.device);
    self.device = null;
  });
  Adapter.call(this);
  return this;
};

/**
 * open deivce
 * @param  {Function} callback
 * @return {[type]}
 */
Serial.prototype.open = function(callback){
  this.device.open(callback);
  return this;
};

/**
 * write data to serialport device
 * @param  {[type]}   buf      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Serial.prototype.write = function(data, callback){
  this.device.write(data, callback);
  return this;
};

/**
 * close device
 * @return {[type]} [description]
 */
Serial.prototype.close = function(callback) {
  var self = this;
  this.device.drain(function(err) {
    self.device.close();
    self.device = null;
    callback && callback(err, self.device);
  });
  return this;
};

/**
 * expose
 */
module.exports = Adapter.extends(Serial);
