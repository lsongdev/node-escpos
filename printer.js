'use strict';
const iconv     = require('iconv-lite');
const CONSTANTS = require('./constants');

/**
 * [function ESC/POS Printer]
 * @param  {[type]} adapter [description]
 * @return {[type]}         [description]
 */
var Printer = function(adapter){
  this.adapter = adapter;
  this.adapter.open();
};
/**
 * [function print]
 * @param  {[type]}   content  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Printer.prototype.print = function(content, encode){
  this.adapter.write(iconv.encode(content, encode || 'gbk'));
};
/**
 * [function println]
 * @param  {[type]}   content  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Printer.prototype.println = function(content, callback){
  this.print([ content, CONSTANTS.EOL ].join(''));
};
/**
 * [function Print alpha-numeric text]
 * @param  {[type]}   content  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Printer.prototype.text = function(content, callback){
  this.println(content);
};

/**
 * [function Feed control sequences]
 * @param  {[type]} ctrl [description]
 * @return {[type]}      [description]
 */
Printer.prototype.control = function(ctrl, callback){
  this.adapter.write(CONSTANTS.FEED_CONTROL_SEQUENCES[
    'CTL_' + ctrl.toUpperCase()
  ]);
};
/**
 * [function align]
 * @param  {[type]} align [description]
 * @return {[type]}       [description]
 */
Printer.prototype.align = function(align){
  this.adapter.write(CONSTANTS.TEXT_FORMAT[
    'TXT_ALIGN_' + align.toUpperCase()
  ]);
};
/**
 * [function font]
 * @param  {[type]} family [description]
 * @return {[type]}        [description]
 */
Printer.prototype.font = function(family){
  this.adapter.write(CONSTANTS.TEXT_FORMAT[
    'TXT_FONT_' + family.toUpperCase()
  ]);
};
/**
 * [function style]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
Printer.prototype.style = function(type){
  switch(type.toUpperCase()){
    case 'B':
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_UNDERL_OFF);
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_BOLD_ON);
      break;
    case 'U':
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_BOLD_OFF);
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_UNDERL_ON);
      break;
    case 'U2':
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_BOLD_OFF);
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_UNDERL2_ON);
      break;
    case 'BU':
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_BOLD_ON);
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_UNDERL_ON);
      break;
    case 'BU2':
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_BOLD_ON);
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_UNDERL2_ON);
      break;
    case 'NORMAL':
    default:
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_BOLD_OFF);
      this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_UNDERL_OFF);
      break;
  }
};
/**
 * [function size]
 * @param  {[type]} width  [description]
 * @param  {[type]} height [description]
 * @return {[type]}        [description]
 */
Printer.prototype.size = function(width, height){
  // DEFAULT SIZE: NORMAL
  this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_NORMAL);
  if(width == 2)  this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_2WIDTH);
  if(height == 2) this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_2HEIGHT);
};
/**
 * [function hardware]
 * @param  {[type]} hw [description]
 * @return {[type]}    [description]
 */
Printer.prototype.hardware = function(hw){
  this.adapter.write(CONSTANTS.HARDWARE[ 'HW_'+ hw ]);
};
/**
 * [function barcode]
 * @param  {[type]} code     [description]
 * @param  {[type]} type     [description]
 * @param  {[type]} width    [description]
 * @param  {[type]} height   [description]
 * @param  {[type]} position [description]
 * @param  {[type]} font     [description]
 * @return {[type]}          [description]
 */
Printer.prototype.barcode = function(code, type, width, height, position, font){
  if(width >= 1 || width <= 255){
    this.adapter.write(CONSTANTS.BARCODE_FORMAT.BARCODE_WIDTH);
  }
  if(height >=2  || height <= 6){
    this.adapter.write(CONSTANTS.BARCODE_FORMAT.BARCODE_HEIGHT);
  }
  this.adapter.write(CONSTANTS.BARCODE_FORMAT[
    'BARCODE_FONT_' + (font || 'A').toUpperCase()
  ]);
  this.adapter.write(CONSTANTS.BARCODE_FORMAT[
    'BARCODE_TXT_' + (position || 'BLW').toUpperCase()
  ]);
  this.adapter.write(CONSTANTS.BARCODE_FORMAT[
    'BARCODE_' + ((type || 'EAN13').replace('-', '_').toUpperCase())
  ]);
  this.adapter.write(code);
};
/**
 * [function description]
 * @param  {[type]} filename [description]
 * @return {[type]}          [description]
 */
Printer.prototype.image = function(filename){
  throw new Error('Not implemented yet.');
};

/**
 * [function Send pulse to kick the cash drawer]
 * @param  {[type]} pin [description]
 * @return {[type]}     [description]
 */
Printer.prototype.cashdraw = function(pin){
  this.adapter.write(CONSTANTS.CASH_DRAWER[
    'CD_KICK_' + (pin || 2)
  ]);
};

/**
 * [function Cut paper]
 * @param  {[type]} part [description]
 * @return {[type]}      [description]
 */
Printer.prototype.cut = function(part){
  // this.println(new Array(30).join('.'));
  this.print(new Array(3).join(CONSTANTS.EOL));
  this.adapter.write(CONSTANTS.PAPER[
    part ? 'PAPER_PART_CUT' : 'PAPER_FULL_CUT'
  ]);
};

module.exports = Printer;
