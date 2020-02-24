'use strict';
const util         = require('util');
const EventEmitter = require('events');

/**
 * [Adapter description]
 */
function Adapter(){
  EventEmitter.call(this);
  return this;
}

util.inherits(Adapter, EventEmitter);

/**
 * [extends description]
 * @param  {[type]} ctor [description]
 * @return {[type]}      [description]
 */
Adapter.extends = function(ctor){
  // console.log(ctor);
  util.inherits(ctor, Adapter);
  return ctor;
};

/**
 * [open description]
 * @return {[type]} [description]
 */
Adapter.prototype.open = function () {
  throw new Error('NotImplementedException');
  return this;
};

/**
 * [close description]
 * @return {[type]} [description]
 */
Adapter.prototype.close = function () {
  throw new Error('NotImplementedException');
  return this;
};

/**
 * [write description]
 * @return {[type]} [description]
 */
Adapter.prototype.write = function () {
  throw new Error('NotImplementedException');
  return this;
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = Adapter;