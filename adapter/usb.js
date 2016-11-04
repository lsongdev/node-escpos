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
  if(vid && pid){
    this.device = usb.findByIds(vid, pid);
  }else{
    this.device = USB.findPrinter();
  }
  
  if (!this.device)
    throw new Error('Can not find printer');
  
  usb.on('detach', function(device){
    if(device == self.device){
      self.emit('detach'    , device);
      self.emit('disconnect', device);
      self.device = null;
    }
  });
  EventEmitter.call(this);  
  return this;
};

/**
 * [findPrinter description]
 * @return {[type]} [description]
 */
USB.findPrinter = function(){
  return usb.getDeviceList().filter(function(device){
    try{
      return device.configDescriptor.interfaces.filter(function(iface){
        return iface.filter(function(conf){
          return conf.bInterfaceClass == IFACE_CLASS.PRINTER;
        }).length;
      }).length;
    }catch(e){
      return false;
    }
  })[0];
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
USB.prototype.open = function (callback){
  var self = this, endpoints = [];
  this.device.open();
  this.device.interfaces.forEach(function(iface){
    iface.setAltSetting(iface.altSetting, function(){
      iface.claim(); // must be called before using any endpoints of this interface.
      endpoints = endpoints.concat(iface.endpoints.filter(function(endpoint){
        return endpoint.direction == 'out';
      }));
    });
  });
  if(endpoints.length){
    this.endpoint = endpoints[0];
    this.emit('connect', this.device);
    callback && callback(null, this.device);
  }else{
    callback && callback(new Error('Can not find endpoint from printer'));
  }
  return this;
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

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = USB;
