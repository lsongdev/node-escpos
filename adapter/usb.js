'use strict';
const os           = require('os');
const util          = require('util');
const EventEmitter  = require('events');
let usb = null;

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

  if (!usb) {
    usb = require('usb');
  }

  EventEmitter.call(this);
  var self = this;
  this.device = null;
  if(vid && pid){
    this.device = usb.findByIds(vid, pid);
  }else if(vid){
      // Set spesific USB device from devices array as coming from USB.findPrinter() function.
      // for example
      // let devices = escpos.USB.findPrinter();
      // => devices [ Device1, Device2 ];
      // And Then
      // const device = new escpos.USB(Device1); OR device = new escpos.USB(Device2);
      this.device = vid;
  }else{
    var devices = USB.findPrinter();
    if(devices && devices.length)
      this.device = devices[0];
  }
  if (!this.device)
    throw new Error('Can not find printer');

  usb.on('detach', function(device){
    if(device == self.device) {
      self.emit('detach'    , device);
      self.emit('disconnect', device);
      self.device = null;
    }
  });

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
          return conf.bInterfaceClass === IFACE_CLASS.PRINTER;
        }).length;
      }).length;
    }catch(e){
      // console.warn(e)
      return false;
    }
  });
};
/**
 * getDevice
 */
USB.getDevice = function(vid, pid){
  return new Promise((resolve, reject) => {
    const device = new USB(vid, pid);
    device.open(err => {
      if(err) return reject(err);
      resolve(device);
    });
  });
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
  let self = this, counter = 0, index = 0;
  this.device.open();
  this.device.interfaces.forEach(function(iface){
    (function(iface){
      iface.setAltSetting(iface.altSetting, function(){
        try {
          // http://libusb.sourceforge.net/api-1.0/group__dev.html#gab14d11ed6eac7519bb94795659d2c971
          // libusb_kernel_driver_active / libusb_attach_kernel_driver / libusb_detach_kernel_driver : "This functionality is not available on Windows."
          if ("win32" !== os.platform()) {
            if(iface.isKernelDriverActive()) {
              try {
                iface.detachKernelDriver();
              } catch(e) {
                console.error("[ERROR] Could not detatch kernel driver: %s", e)
              }
            }
          }
          iface.claim(); // must be called before using any endpoints of this interface.
          iface.endpoints.filter(function(endpoint){
            if(endpoint.direction == 'out' && !self.endpoint) {
              self.endpoint = endpoint;
            }
          });
          if(self.endpoint) {
            self.emit('connect', self.device);
            callback && callback(null, self);
          } else if(++counter === this.device.interfaces.length && !self.endpoint){
            callback && callback(new Error('Can not find endpoint from printer'));
          }
        } catch (e) {
          // Try/Catch block to prevent process from exit due to uncaught exception.
          // i.e LIBUSB_ERROR_ACCESS might be thrown by claim() if USB device is taken by another process
          // example: MacOS Parallels
          callback && callback(e);
        }
      });
    })(iface);
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
  return this;
};

USB.prototype.close = function(callback){

  if(this.device) {

    try {

      this.device.close();
      usb.removeAllListeners('detach');

      callback && callback(null);
      this.emit('close', this.device);

    }
    catch (e) {
      callback && callback(e);
    }

  }
  else {
    callback && callback(null);
  }

  return this;

};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = USB;
