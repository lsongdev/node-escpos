'use strict';
const util         = require('util');
const qr           = require('qr-image');
const iconv        = require('iconv-lite');
const getPixels    = require('get-pixels');
const Buffer       = require('mutable-buffer');
const EventEmitter = require('events');
const Image        = require('./image');
const utils        = require('./utils');
const _            = require('./commands');

/**
 * [function ESC/POS Printer]
 * @param  {[Adapter]} adapter [eg: usb, network, or serialport]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
function Printer(adapter){
  if (!(this instanceof Printer)) {
    return new Printer(adapter);
  }
  var self = this;
  EventEmitter.call(this);
  this.adapter = adapter;
  this.buffer = new Buffer();
  this.encoding = 'GB18030';
};

/**
 * Printer extends EventEmitter
 */
util.inherits(Printer, EventEmitter);

/**
 * Fix bottom margin
 * @param  {[String]} size
 * @return printer instance
 */
Printer.prototype.marginBottom = function(size){
  this.buffer.write(_.MARGINS.BOTTOM);
  this.buffer.writeUInt8(size);
  return this;
};

/**
 * Fix left margin
 * @param  {[String]} size
 * @return printer instance
 */
Printer.prototype.marginLeft = function(size){
  this.buffer.write(_.MARGINS.LEFT);
  this.buffer.writeUInt8(size);
  return this;
};

/**
 * Fix right margin
 * @param  {[String]} size
 * @return printer instance
 */
Printer.prototype.marginRight = function(size){
  this.buffer.write(_.MARGINS.RIGHT);
  this.buffer.writeUInt8(size);
  return this;
};

/**
 * Send data to hardware and flush buffer
 * @param  {Function} callback
 * @return printer instance
 */
Printer.prototype.flush = function(callback){
  var buf = this.buffer.flush();
  this.adapter.write(buf, callback);
  return this;
};
/**
 * [function print]
 * @param  {[String]}  content  [description]
 * @param  {[String]}  encoding [description]
 * @return printer instance
 */
Printer.prototype.print = function(content){
  this.buffer.write(content);
  return this;
};
/**
 * [function println]
 * @param  {[String]}  content  [description]
 * @param  {[String]}  encoding [description]
 * @return printer instance
 */
Printer.prototype.println = function(content){
  return this.print([ content, _.EOL ].join(''));
};

/**
 * [function Print alpha-numeric text]
 * @param  {[String]}  content  [description]
 * @param  {[String]}  encoding [description]
 * @return printer instance
 */
Printer.prototype.text = function(content, encoding){
  return this.print(iconv.encode(content + _.EOL, encoding || this.encoding));
};

/**
 * [function encode text]
 * @param  {[String]}  encoding [description]
 * @return printer instance
 */
Printer.prototype.encode = function(encoding) {
  this.encoding = encoding;
  return this;
}

/**
 * [line feed]
 * @param  {[type]}    lines   [description]
 * @return {[Printer]} printer [description]
 */
Printer.prototype.feed = function (n) {
  this.buffer.write(new Array(n || 1).fill(_.EOL).join(''));
  return this.flush();
};

/**
 * [feed control sequences]
 * @param  {[type]}    ctrl     [description]
 * @return printer instance
 */
Printer.prototype.control = function(ctrl){
  this.buffer.write(_.FEED_CONTROL_SEQUENCES[
    'CTL_' + ctrl.toUpperCase()
  ]);
  return this;
};
/**
 * [text align]
 * @param  {[type]}    align    [description]
 * @return printer instance
 */
Printer.prototype.align = function(align){
  this.buffer.write(_.TEXT_FORMAT[
    'TXT_ALIGN_' + align.toUpperCase()
  ]);
  return this;
};
/**
 * [font family]
 * @param  {[type]}    family  [description]
 * @return {[Printer]} printer [description]
 */
Printer.prototype.font = function(family){
  this.buffer.write(_.TEXT_FORMAT[
    'TXT_FONT_' + family.toUpperCase()
  ]);
  return this;
};
/**
 * [font style]
 * @param  {[type]}    type     [description]
 * @return printer instance
 */
Printer.prototype.style = function(type){
  switch(type.toUpperCase()){

    case 'B':
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
      break;
    case 'I':
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
      break;
    case 'U':
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
      break;
    case 'U2':
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
      break;

    case 'BI':
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
      break;
    case 'BIU':
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
      break;
    case 'BIU2':
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
      break;
    case 'BU':
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
      break;
    case 'BU2':
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
      break;
    case 'IU':
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
      break;
    case 'IU2':
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
      break;

    case 'NORMAL':
    default:
      this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
      this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
      break;

  }
  return this;
};

/**
 * [font size]
 * @param  {[String]}  width   [description]
 * @param  {[String]}  height  [description]
 * @return {[Printer]} printer [description]
 */
Printer.prototype.size = function(width, height) {
  if (2 >= width && 2 >= height) {
    this.buffer.write(_.TEXT_FORMAT.TXT_NORMAL);
    if (2 == width && 2 == height) {
      this.buffer.write(_.TEXT_FORMAT.TXT_4SQUARE);
    } else if (1 == width && 2 == height) {
      this.buffer.write(_.TEXT_FORMAT.TXT_2HEIGHT);
    } else if (2 == width && 1 == height) {
      this.buffer.write(_.TEXT_FORMAT.TXT_2WIDTH);
    }
  } else {
    this.buffer.write(_.TEXT_FORMAT.TXT_CUSTOM_SIZE(width, height));
  }
  return this;
};

/**
 * [set line spacing]
 * @param  {[type]} n [description]
 * @return {[type]}   [description]
 */
Printer.prototype.lineSpace = function(n) {
  if (n === undefined || n === null) {
    this.buffer.write(_.LINE_SPACING.LS_DEFAULT);
  } else {
    this.buffer.write(_.LINE_SPACING.LS_SET);
    this.buffer.writeUInt8(n);
  }
  return this;
};

/**
 * [hardware]
 * @param  {[type]}    hw       [description]
 * @return printer instance
 */
Printer.prototype.hardware = function(hw){
  this.buffer.write(_.HARDWARE[ 'HW_'+ hw ]);
  return this.flush();
};
/**
 * [barcode]
 * @param  {[type]}    code     [description]
 * @param  {[type]}    type     [description]
 * @param  {[type]}    width    [description]
 * @param  {[type]}    height   [description]
 * @param  {[type]}    position [description]
 * @param  {[type]}    font     [description]
 * @return printer instance
 */
Printer.prototype.barcode = function(code, type, width, height, position, font){
  type = type || 'EAN13'; // default type is EAN13, may a good choice ?
  var convertCode = String(code), parityBit = '';
  if(typeof type === 'undefined' || type === null){
    throw new TypeError('barcode type is required');
  }
  if (type === 'EAN13' && convertCode.length != 12) {
    throw new Error('EAN13 Barcode type requires code length 12');
  }
  if (type === 'EAN8' && convertCode.length != 7) {
    throw new Error('EAN8 Barcode type requires code length 7');
  }
  if(width >= 2 || width <= 6){
    this.buffer.write(_.BARCODE_FORMAT.BARCODE_WIDTH[width]);
  }else{
    this.buffer.write(_.BARCODE_FORMAT.BARCODE_WIDTH_DEFAULT);
  }
  if(height >=1  || height <= 255){
    this.buffer.write(_.BARCODE_FORMAT.BARCODE_HEIGHT(height));
  }else{
    this.buffer.write(_.BARCODE_FORMAT.BARCODE_HEIGHT_DEFAULT);
  }
  this.buffer.write(_.BARCODE_FORMAT[
    'BARCODE_FONT_' + (font || 'A').toUpperCase()
  ]);
  this.buffer.write(_.BARCODE_FORMAT[
    'BARCODE_TXT_' + (position || 'BLW').toUpperCase()
  ]);
  this.buffer.write(_.BARCODE_FORMAT[
    'BARCODE_' + ((type || 'EAN13').replace('-', '_').toUpperCase())
  ]);
  if (type === 'EAN13' || type === 'EAN8') {
    parityBit = utils.getParityBit(code);
  }
  this.buffer.write(code + parityBit);
  return this;
};

/**
 * [print qrcode]
 * @param  {[type]} code    [description]
 * @param  {[type]} version [description]
 * @param  {[type]} level   [description]
 * @param  {[type]} size    [description]
 * @return {[type]}         [description]
 */
Printer.prototype.qrcode = function(code, version, level, size){
  this.buffer.write(_.CODE2D_FORMAT.TYPE_QR);
  this.buffer.write(_.CODE2D_FORMAT.CODE2D);
  this.buffer.writeUInt8(version || 3);
  this.buffer.write(_.CODE2D_FORMAT[
    'QR_LEVEL_' + (level || 'L').toUpperCase()
  ]);
  this.buffer.writeUInt8(size || 6);
  this.buffer.writeUInt16LE(code.length);
  this.buffer.write(code);
  return this;
};

/**
 * [print qrcode image]
 * @param  {[type]}   content  [description]
 * @param  {[type]}   options  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Printer.prototype.qrimage = function(content, options, callback){
  var self = this;
  if(typeof options == 'function'){
    callback = options;
    options = null;
  }
  options = options || { type: 'png', mode: 'dhdw' };
  var buffer = qr.imageSync(content, options);
  var type = [ 'image', options.type ].join('/');
  getPixels(buffer, type, function (err, pixels) {
    if(err) return callback && callback(err);
    self.raster(new Image(pixels), options.mode);
    callback && callback.call(self, null, self);
  });
  return this;
};

/**
 * [image description]
 * @param  {[type]} image   [description]
 * @param  {[type]} density [description]
 * @return {[type]}         [description]
 */
Printer.prototype.image = function(image, density){
  if(!(image instanceof Image))
    throw new TypeError('Only escpos.Image supported');
  density = density || 'd24';
  var n = !!~[ 'd8', 's8' ].indexOf(density) ? 1 : 3;
  var header = _.BITMAP_FORMAT['BITMAP_' + density.toUpperCase()];
  var bitmap = image.toBitmap(n * 8);
  var self = this;
  this.lineSpace(0); // set line spacing to 0
  bitmap.data.forEach(function (line) {
    self.buffer.write(header);
    self.buffer.writeUInt16LE(line.length / n);
    self.buffer.write(line);
    self.buffer.write(_.EOL);
  });
  // restore line spacing to default
  return this.lineSpace();
};

/**
 * [raster description]
 * @param  {[type]} image [description]
 * @param  {[type]} mode  [description]
 * @return {[type]}       [description]
 */
Printer.prototype.raster = function (image, mode) {
  if(!(image instanceof Image))
    throw new TypeError('Only escpos.Image supported');
  mode = mode || 'normal';
  if (mode === 'dhdw' ||
      mode === 'dwh'  ||
      mode === 'dhw') mode = 'dwdh';
  var raster = image.toRaster();
  var header = _.GSV0_FORMAT['GSV0_' + mode.toUpperCase()];
  this.buffer.write(header);
  this.buffer.writeUInt16LE(raster.width);
  this.buffer.writeUInt16LE(raster.height);
  this.buffer.write(raster.data);
  return this;
};

/**
 * [function Cut paper]
 * @param  {[type]} part [description]
 * @return printer instance
 */
Printer.prototype.cut = function(part, feed){
  this.feed(feed || 3);
  this.buffer.write(_.PAPER[
    part ? 'PAPER_PART_CUT' : 'PAPER_FULL_CUT'
  ]);
  return this.flush();
};

/**
 * [function Send pulse to kick the cash drawer]
 * @param  {[type]} pin [description]
 * @return printer instance
 */
Printer.prototype.cashdraw = function(pin){
  this.buffer.write(_.CASH_DRAWER[
    'CD_KICK_' + (pin || 2)
  ]);
  return this.flush();
};

/**
 * [close description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Printer.prototype.close = function(callback){
  var self = this;
  return this.flush(function(){
    self.adapter.close(callback);
  });
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = Printer;
