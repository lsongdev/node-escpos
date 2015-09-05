var Serial = function(tty){
  this.device = null;
};

Serial.prototype.open = function(){
  this.device.open.apply(this, arguments);
};
Serial.prototype.write = function(){
  this.device.write.apply(this, arguments);
};

module.exports = Serial;
