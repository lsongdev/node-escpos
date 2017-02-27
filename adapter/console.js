'use strict';
/**
 * [stdout description]
 * @param  {[type]} data [description]
 * @param  {[type]} bit  [description]
 * @return {[type]}      [description]
 */
function stdout(data, bit){
  bit = bit || 8;
  for(var i=0;i < data.length;i+= bit){
    var arr = [];
    for(var j=0;j<bit && i+j<data.length;j++) 
      arr.push(data[i + j]);
    arr = arr.map(function(b){
      return b.toString(16).toUpperCase()
    }).map(function(b){
      if(b.length == 1) b = '0' + b;
      return b;
    })
    
    console.log(arr.join(' '));
  }
  console.log();
}

/**
 * [Console description]
 */
function Console(handler){
  this.handler = handler || stdout;
};
/**
 * [open description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Console.prototype.open = function(callback){
  callback && callback();
};
/**
 * [write description]
 * @param  {[type]} data [description]
 * @param  {[type]} bit  [description]
 * @return {[type]}      [description]
 */
Console.prototype.write = function(data){
  this.handler && this.handler(data);
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = Console;
