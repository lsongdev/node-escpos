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
 * Returns an array of all available bluetooth devices with a serial port
 * @return {Promise<any[]>} Device objects with address, name, channel
 */
Bluetooth.findPrinters = async function(){
  if (device === null) {
    device = new bluetooth.DeviceINQ();
  }
  let devices = await device.scan();
  let printers = await Promise.all(devices.map(({address, name}) => {
    return new Promise((resolve, reject) => {
      device.findSerialPortChannel(address, function(channel){
        if (channel === -1) {
          resolve(undefined);
        } else {
          resolve({
            address,
            name,
            channel
          })
        }
      });
    });
  }));
  return printers;
};

/**
 * Returns a connected Blueetooth device
 * @param {string} address Bluetooth Address
 * @param {number} channel Bluetooth channel
 * @return {Promise<any>} connected device if everything is ok, error otherwise
 */
Bluetooth.getDevice = async function(address, channel){
  return new Promise((resolve, reject) => {
    const device = new Bluetooth(address, channel);
    device.open(err => {
      if(err) return reject(err);
      resolve(device);
    });
  });
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
