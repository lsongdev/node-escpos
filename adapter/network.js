'use strict';
const net          = require('net');
const util         = require('util');
const EventEmitter = require('events');
/**
 * [Network description]
 * @param {[type]} address [description]
 * @param {[type]} port    [description]
 */
function Network(address, port){
  EventEmitter.call(this);  
  this.address = address;
  this.port = port || 9100;
  this.device = new net.Socket();
  return this;
};
/**
 * make Network extends EventEmitter
 */
util.inherits(Network, EventEmitter);

/**
 * connect to device
 * 
 * @praram {[type]} callback
 * @return
 */
Network.prototype.open = function(callback){
  var self = this;
  //connect to net printer by socket (port,ip)
  this.device.connect(this.port, this.address, function(err){
    self.emit('connect', self.device);
    callback && callback(err);
  });
  return this;
};

/**
 * write data to printer
 * 
 * @param {[type]} data -- byte data
 * @return 
 */
Network.prototype.write = function(data, callback){
  this.device.write(data, callback);
  return this;
};

/**
 * [close description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Network.prototype.close = function(callback){
  if(this.device){
    this.device.destroy();
    this.device = null;
  }
  this.emmit('disconnect',this.device);
  callback && callback();
  return this;
}

module.exports = Network;
