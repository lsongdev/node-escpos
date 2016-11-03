'use strict';

const util = require('util');
const net = require('net');
const EventEmitter = require('events');

const Socket = net.Socket;

var Network = function(address, port){

  this.address = address;
  this.port = port || 9100;

  EventEmitter.call(this);

  this.device = new Socket();
  return this;
};
/**
 * make Network extends EventEmitter
 */
util.inherits(Network,EventEmitter);

/**
 * connect to device
 * 
 * @praram {[type]} callback
 * @return
 */
Network.prototype.open = function(callback){
  var thiz = this;
  //connect to net printer by socket (port,ip)
  this.device.connect(this.port,this.address,function(){

    thiz.emit('connect',thiz.device);
    callback && callback();
  });

};

/**
 * write data to printer
 * 
 * @param {[type]} data -- byte data
 * @return 
 */
Network.prototype.write = function(data,callback){
  this.device.write(data);

  callback && callback();

};

Network.prototype.close = function(callback){
  if(this.device){
    console.log('destory');
    this.device.destroy();
    this.device = null;
  }
  this.emmit('disconnected',this.device);
  callback && callback();
}


module.exports = Network;
