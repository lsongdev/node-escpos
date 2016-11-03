'use strict';
const util         = require('util');
const EventEmitter = require('events');
const SerialPort   = require('serialport');

/**
 * [Serial description]
 * @param {[type]} port    [description]
 * @param {[type]} options [description]
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
  EventEmitter.call(this);  
  return this;
};

util.inherits(Serial, EventEmitter);

/**
 * [open description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Serial.prototype.open = function(callback){
  this.device.open(callback);
  return this;
};
/**
 * [write description]
 * @param  {[type]}   buf      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Serial.prototype.write = function(buf, callback){
  this.device.write(buf, callback);
  return this;
};

/**
 * [close description]
 * @return {[type]} [description]
 */
Serial.prototype.close = function() {
  var self = this;
  this.device.drain(function() {
    self.device.close();
    self.device = null;
  });
  return this;
};

module.exports = Serial;
