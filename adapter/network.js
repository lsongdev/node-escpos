var Network = function(address, port){
  this.device = null;
};

Network.prototype.open = function(){
  this.device.open.apply(this, arguments);
};
Network.prototype.write = function(){
  this.device.write.apply(this, arguments);
};

module.exports = Network;
