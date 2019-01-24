'use strict';
const util = require('util');
const iconv = require('iconv-lite');
const { MutableBuffer } = require('mutable-buffer');
const EventEmitter = require('events');
const _ = require('./commands');
const Promiseify = require('./promiseify');

/**
 * [function ESC/POS Screen]
 * @param  {[Adapter]} adapter [eg: usb, network, or serialport]
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
function Screen(adapter, options) {
  if (!(this instanceof Screen)) {
    return new Screen(adapter);
  }
  var self = this;
  EventEmitter.call(this);
  this.adapter = adapter;
  this.buffer = new MutableBuffer();
  this.encoding = options && options.encoding || 'GB18030';
  this._model = null;
};

Screen.create = function (device) {
  const Screen = new Screen(device);
  return Promise.resolve(Promiseify(Screen))
};

/**
 * Screen extends EventEmitter
 */
util.inherits(Screen, EventEmitter);

/**
 * Clears all displayed characters
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.clear = function (callback) {
  this.buffer.write(_.SCREEN.CLR, callback);
  return this;
};

/**
 * Clears the line containing the cursor
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.clearLine = function (callback) {
  this.buffer.write(_.SCREEN.CAN, callback);
  return this;
};

/**
 * Moves the cursor up one line
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.moveUp = function (callback) {
  this.buffer.write(_.SCREEN.US_LF, callback);
  return this;
};

/**
 * Moves the cursor one character position to the left
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.moveLeft = function (callback) {
  this.buffer.write(_.SCREEN.BS, callback);
  return this;
};

/**
 * Moves the cursor one character position to the right
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.moveRight = function (callback) {
  this.buffer.write(_.SCREEN.HT, callback);
  return this;
};

/**
 * Moves the cursor down one line
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.moveDown = function (callback) {
  this.buffer.write(_.SCREEN.LF, callback);
  return this;
};

/**
 * Moves the cursor to the left-most position on the upper line (home position)
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.moveHome = function (callback) {
  this.buffer.write(_.SCREEN.HOM, callback);
  return this;
};

/**
 * Moves the cursor to the right-most position on the current line
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.moveMaxRight = function (callback) {
  this.buffer.write(_.SCREEN.US_CR, callback);
  return this;
};

/**
 * Moves the cursor to the left-most position on the current line
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.moveMaxLeft = function (callback) {
  this.buffer.write(_.SCREEN.CR, callback);
  return this;
};

/**
 * Moves the cursor to the bottom position
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.moveBottom = function (callback) {
  this.buffer.write(_.SCREEN.US_B, callback);
  return this;
};

/**
 * Moves the cursor to the nth position on the mth line
 * @param  {[type]}   n       [description]
 * @param  {[type]}   m       [description]
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.move = function (n, m) {
  this.buffer.write(_.SCREEN.US_$);
  this.buffer.writeUInt8(n);
  this.buffer.writeUInt8(m);
  return this;
};

/**
 * Selects overwrite mode as the screen display mode
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.overwrite = function (callback) {
  this.buffer.write(_.SCREEN.US_MD1, callback);
  return this;
};

/**
 * Selects vertical scroll mode as the screen display mode
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.verticalScroll = function (callback) {
  this.buffer.write(_.SCREEN.US_MD2, callback);
  return this;
};

/**
 * Selects horizontal scroll mode as the display screen mode
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.horizontalScroll = function (callback) {
  this.buffer.write(_.SCREEN.US_MD3, callback);
  return this;
};

/**
 * Turn cursor display mode on/off
 * @param  {[type]}   display [description]
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.cursor = function (display) {
  this.buffer.write(_.SCREEN.US_C);
  if (display) {
    this.buffer.writeUInt8(1);
  } else {
    this.buffer.writeUInt8(0);
  }
  return this;
};

/**
 * Sets display screen blank interval
 * @param  {[type]}   step    [description]
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.blink = function (step) {
  this.buffer.write(_.SCREEN.US_E);
  this.buffer.writeUInt8(step);
  return this;
};

/**
 * Sets the counter time and displays it in the bottom right of the screen
 * @param  {[type]}   h       [description]
 * @param  {[type]}   m       [description]
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.timer = function (h, m) {
  this.buffer.write(_.SCREEN.US_T);
  this.buffer.writeUInt8(h);
  this.buffer.writeUInt8(m);
  return this;
};

/**
 * Displays the time counter at the right side of the bottom line
 * @param  {Function} callback
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.displayTimer = function () {
  this.buffer.write(_.SCREEN.US_U);
  return this;
};

/**
 * Set brightness
 * @param  {[type]}   level   [description]
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.brightness = function (level) {
  this.buffer.write(_.SCREEN.US_X);
  this.buffer.writeUInt8(level);
  return this;
};

/**
 * Selects or cancels reverse display of the characters received after this command
 * @param  {[type]}   n       [description]
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.reverse = function (n) {
  this.buffer.write(_.SCREEN.US_r);
  if (n) {
    this.buffer.writeUInt8(1);
  } else {
    this.buffer.writeUInt8(0);
  }
  return this;
};

/**
 * Set status confirmation for DTR signal
 * @param  {[type]}   n       [description]
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.DTR = function (n) {
  this.buffer.write(_.SCREEN.US_v);
  if (n) {
    this.buffer.writeUInt8(1);
  } else {
    this.buffer.writeUInt8(0);
  }
  return this;
};

/**
 * [function print]
 * @param  {[String]}  content  [mandatory]
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.print = function (content) {
  this.buffer.write(content);
  return this;
};

/**
 * [function Print encoded alpha-numeric text with End Of Line]
 * @param  {[String]}  content  [mandatory]
 * @param  {[String]}  encoding [optional]
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.text = function (content, encoding) {
  return this.print(iconv.encode(content, encoding || this.encoding));
};

/**
 * [function encode text]
 * @param  {[String]}  encoding [mandatory]
 * @return {[Screen]} Screen  [the escpos Screen instance]
 */
Screen.prototype.encode = function (encoding) {
  this.encoding = encoding;
  return this;
};

/**
 * Send data to hardware and flush buffer
 * @param  {Function} callback
 * @return {[Screen]} printer  [the escpos printer instance]
 */
Screen.prototype.flush = function (callback) {
  var buf = this.buffer.flush();
  this.adapter.write(buf, callback);
  return this;
};

/**
 * [close description]
 * @param  {Function} callback [description]
 * @param  {[type]}   options  [description]
 * @return {[type]}            [description]
 */
Screen.prototype.close = function (callback, options) {
  var self = this;
  return this.flush(function () {
    self.adapter.close(callback, options);
  });
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = Screen;
