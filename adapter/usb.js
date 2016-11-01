'use strict';
const util          = require('util');
const usb           = require('usb') ;
const EventEmitter  = require('events');

/**
 * [USB Class Codes ]
 * @type {Object}
 * @docs http://www.usb.org/developers/defined_class
 */
const CLASS_CODE = {
  AUDIO  : 0x01,
  HID    : 0x03,
  PRINTER: 0x07,
  HUB    : 0x09
};
/**
 * [findPrinter description]
 * @return {[type]} [description]
 */
function findPrinter(){
  var devices = usb.getDeviceList();
  devices = devices.filter(function(device){
    try{
      return device.configDescriptor.interfaces.filter(function(iface){
        return iface.filter(function(conf){
          return conf.bInterfaceClass == CLASS_CODE.PRINTER;
        }).length;
      }).length;
    }catch(e){
      return false;
    }
  });
  return devices[0];
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
    this.device = findPrinter();
  }
  
  if (!this.device)
    throw new Error('Can not find printer');
  
  //https://github.com/jor3l/node-escpos/blob/master/adapter/usb.js#L84
  usb.on('detach', function(device){
    if(device == self.device){
      self.emit('detach'    , device);
      self.emit('disconnect', device);
      self.device = null;
    }
  });
  
  return this;
};

/**
 * make USB extends EventEmitter
 */
util.inherits(USB, EventEmitter);

/**
 * [open description]
 * @return {[type]} [description]
 */
USB.prototype.open = function (callback){
  var self = this;
  this.device.open();
  this.device.interfaces.forEach(function(iface){
    try{
      if(iface.isKernelDriverActive())
        iface.detachKernelDriver();
    }catch(e){
      console.error("[ERROR] Could not detatch kernel driver: %s", e);
    }
    iface.claim();
    iface.setAltSetting(iface.altSetting, function(){
      iface.endpoints.filter(function(endpoint){
        if(endpoint.direction == 'out'){
          self.endpoint = endpoint;
          self.emit('connect', self.device);
          callback && callback(null, self);
        }
      });
      if(!self.endpoint){
        callback && callback(new Error('Can not find endpoint from printer'));
      }
    });

  });
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
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = USB;
