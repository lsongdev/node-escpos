'use strict';
const getPixels = require('get-pixels');
const Image     = require('./image');

/**
 * [image description]
 * @param  {[type]}   url      [description]
 * @param  {[type]}   type     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.image = function(url, type, callback){
  if(typeof type == 'function'){
    callback = type;
    type = null;
  }
  getPixels(url, type, function(err, pixels){
    if(err) return callback(err);
    callback(new Image(pixels));
  });
};


/**
 * [Image description]
 * @type {[type]}
 */
exports.Image = Image;

/**
 * [USB description]
 * @type {[type]}
 */
exports.USB       = require('./adapter/usb');
exports.Console   = require('./adapter/console');


/**
 * [Printer description]
 * @type {[type]}
 */
exports.Printer   = require('./printer');
exports.commands  = require('./commands');