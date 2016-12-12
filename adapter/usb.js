'use strict';
const usb           = require('usb');
const util          = require('util');
const EventEmitter  = require('events');

/**
 * [USB Class Codes ]
 * @type {Object}
 * @docs http://www.usb.org/developers/defined_class
 */
const IFACE_CLASS = {
  AUDIO  : 0x01,
  HID    : 0x03,
  PRINTER: 0x07,
  HUB    : 0x09
};

/**
 * [function USB]
 * @param  {[type]} vid [description]
 * @param  {[type]} pid [description]
 * @return {[type]}     [description]
 */
function USB(vid, pid){
  var self = this;

  this.device = null;
  this.devices = [];

  if(vid && pid){
    this.devices = [usb.findByIds(vid, pid)];
    this.device = this.devices[0];
  }else{
    this.findPrinter();
  }

  if (!this.device)
    throw new Error('Can not find printer');

  usb.on('detach', function(device){
    self.emit('detach'    , device);
    self.emit('disconnect', device);

    for(let i in self.devices) {
      if(device == self.devices[i]) {
        self.devices.splice(i, 1);
      }
    }

    if(device == self.device) {
      if(self.devices.length > 0) {
        self.device = self.devices[0];
      } else self.device = null;
    }
  });
  EventEmitter.call(this);
  return this;
};

/**
 * [findPrinter description]
 * @return {[type]} [description]
 */
USB.prototype.findPrinter = function(){
  this.devices = usb.getDeviceList().filter(function(device){
    try{
      return device.configDescriptor.interfaces.filter(function(iface){
        return iface.filter(function(conf){
          return conf.bInterfaceClass == IFACE_CLASS.PRINTER;
        }).length;
      }).length;
    }catch(e){
      return false;
    }
  });

  if(this.devices.length > 0) {
    // Select first printer found by default
    this.device = this.devices[0];
  }
};

/**
 * make USB extends EventEmitter
 */
util.inherits(USB, EventEmitter);

/**
 * [open usb device]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
USB.prototype.open = function (callback, i){
  let self = this, counter = 0, index = i || 0;
  this.device.open();
  this.device.interfaces.forEach(function(iface){
    (function(iface){
      iface.setAltSetting(iface.altSetting, function(){
        iface.claim(); // must be called before using any endpoints of this interface.
        iface.endpoints.filter(function(endpoint){
          if(endpoint.direction == 'out' && !self.endpoint) {
            self.endpoint = endpoint;
            self.devices[index]._endpoint = endpoint; // store each endpoint for later
          }
        });

        if(self.endpoint) {
          self.emit('connect', self.device);
          callback && callback(null, self);
        } else if(++counter === this.device.interfaces.length && !self.endpoint){
          callback && callback(new Error('Can not find endpoint from printer'));
        }
      });
    })(iface);
  });

  return this;
};

USB.prototype.openAll = function (callback) {
  this.openNext(0, callback);
  return this;
};

USB.prototype.openNext = function(index, callback) {
  let self = this;

  this.setDevice(index).open(function(err) {
    if(err) {
      console.log(err);
      return;
    }

    if((index+1) == self.devices.length) {
      callback && callback(null);
    } else {
      self.openNext(index+1, callback);
    }
  }, index);

  return this;
}

USB.prototype.setDevice = function(i) {
  if(this.devices[i]) {
    this.device = this.devices[i];
    if('_endpoint' in this.device) {
      this.endpoint = this.device._endpoint;
    } else {
      this.endpoint = null;
    }
  } else throw new Error('Unknown device');

  return this;
};

USB.prototype.getDevices = function() {
  return this.devices.length;
};

/**
 * [function write]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
USB.prototype.write = function(data, callback){
  this.emit('data', data);
  this.endpoint.transfer(data, callback);
  return this;
};

USB.prototype.close = function(callback){
  this.device.close(callback);
  return this;
};

USB.prototype.closeAll = function(callback){
  let self = this;
  self.closeNext(callback);
  return this;
};

USB.prototype.closeNext = function(callback) {
  let self = this;

  self.setDevice(0).close(function() {
    self.devices.splice(0, 1);
    if(self.devices.length == 0) {
      callback && callback(null);
    } else {
      self.closeNext(callback);
    }
  });

  return this;
}

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = USB;
