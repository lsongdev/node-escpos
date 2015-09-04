var usb   = require('usb');

var USB = function(vid, pid){
  this.device = usb.findByIds(vid, pid);
  return this;
};

USB.prototype.open = function () {
  var self = this;
  this.device.open();
  // this.device.reset();
  this.device.interfaces.forEach(function(interface){
    interface.claim();
    if(interface.isKernelDriverActive()){
      try{
        interface.detachKernelDriver();
      }catch(e){
        console.error("Could not detatch kernel driver: %s", e)
      }
    }
    interface.endpoints.filter(function(endpoint){
      if(endpoint.direction == 'out'){
        self.endpoint = endpoint;
      }
    });
  });
  return this;
};

USB.prototype.write = function(data){
  var done = false;
  this.endpoint.transfer(data, function(err){
    if(err) throw err;
    done = true;
  });
};

module.exports = USB;
