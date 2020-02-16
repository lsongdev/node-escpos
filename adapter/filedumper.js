'use strict';

var fs = require('fs');

/**
 * [Console description]
 */
function FileDumper(filename){
  this.filename = filename || 'dump.pos';
};
/**
 * [open description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
FileDumper.prototype.open = function(callback){
  this.stream = fs.createWriteStream(this.filename);
  this.stream.once('open', () => {
      callback && callback();
  })
};

/**
 * [write description]
 * @param  {[type]} data [description]
 * @param  {[type]} bit  [description]
 * @return {[type]}      [description]
 */
FileDumper.prototype.write = function(data, callback){
  this.stream && this.stream.write(data);
  callback && callback();
};

FileDumper.prototype.close = function(callback) {
    this.stream && this.stream.end();
    callback && callback();
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = FileDumper;
