'use strict';
const EventEmitter  = require('events');
const bluetooth     = require('node-bluetooth');
const util          = require('util');

let device = null;
let connection = null;

/**
 * Bluetooth adapter
 * @param {string} address Bluetooth Address
 * @param {number} channel Bluetooth channel
 * @return {Bluetooth}
 * @constructor
 */
function Bluetooth(address, channel){
  EventEmitter.call(this);
  this.address = address;
  this.channel = channel;
  device = new bluetooth.DeviceINQ();
  return this;
};

util.inherits(Bluetooth, EventEmitter);

/**
 * Prints all available bluetooth devices with a serial port to the console
 */
Bluetooth.findPrinter = function(){
  if (device === null) {
    device = new bluetooth.DeviceINQ();
  }
  console.log('Searching for available bluetooth devices with a serial port...');
  let allFound = false;
  let openQueries = 0;
  device.on('finished', function finished(){
    allFound = true;
  });
  device.on('found', function found(address, name){
    openQueries++;
    device.findSerialPortChannel(address, function(channel){
      console.log('Found: ' + name + ' - address: [' + address + '], channel [' + channel + ']');
      openQueries--;
      if (allFound && openQueries <= 0) {
        console.log('finished');
      }
    });
  });
  device.scan();
};

/**
 * Open connection to bluetooth device
 * @param callback
 */
Bluetooth.prototype.open = function(callback){
  var self = this;
  bluetooth.connect(this.address, this.channel, function(err, conn){
    if(err) {
      callback && callback(err);
    } else {
      connection = conn;
      self.emit('connect', connection);
      callback();
    }
  });
};

/**
 * Close bluetooth connection
 * @param callback
 */
Bluetooth.prototype.close = function(callback){
  if (connection === null) {
    return callback();
  }
  var self = this;
  connection.close(function(error){
    if (error) {
      return callback(error);
    }
    self.emit('disconnect', connection);
    connection = null;
    callback();
  });
};

/**
 * Write data to the printer
 * @param data
 * @param callback
 */
Bluetooth.prototype.write = function(data, callback) {
  if (connection === null) {
    return callback(new Error('No open bluetooth connection.'));
  }
  var self = this;
  connection.write(data, function(){
    self.emit('write', data);
    callback();
  });
};

/**
 * expose
 */
module.exports = Bluetooth;
