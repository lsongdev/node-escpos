'use strict';
const { MutableBuffer } = require('mutable-buffer');


function stdout(data){
  console.log(data);
}

/**
 * RawBT for print on client side
 *
 * It is a solution consisting of an android application and a simple server socket for personal computers.
 * This adapter generates data in the desired representation. It is based on base64.
 * A site visitor requests data with a simple ajax request.
 * The received data is transferred to the Android application or sent to the local print server socket on the visitor's computer.
 *
 * @see https://RawBT.ru/
 * @see https://github.com/402d/RawBT_ws_server
 *
 * Front example:
 * @see https://RawBT.ru/mike42/example_RawBT/
 *
 *
 * @param {[type]} handler
 * @constructor
 */
function RawBT(handler){
  this.handler = handler || stdout;
  this.buffer = new MutableBuffer();
  return this;
}
/**
 * Doing nothing
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
RawBT.prototype.open = function(callback){
  callback && callback();
  return this;
};
/**
 * write to buffer
 *
 * @param  {[type]} data [description]
 * @param  {[type]} callback [description]
 */
RawBT.prototype.write = function(data,callback){
  this.buffer.write(data);
  callback && callback();
  return this;
};
/**
 * Close the underlying buffer. With rawbt connector, the
 * job will not actually be sent to the printer until this is called.
 *
 * Real output all buffered data to client in base64 format.
 *
 * @param  {[type]} callback [description]
 */
RawBT.prototype.close = function(callback){
  let data = "intent:base64,";
  let buf = this.buffer.flush();
  data = data + Buffer.from(buf).toString('base64');
  data = data + "#Intent;scheme=RawBT;package=ru.a402d.RawBTprinter;end;";
  this.handler && this.handler(data);
  callback && callback();
  return this;
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = RawBT;
