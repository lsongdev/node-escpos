var CONSTANTS = require('./constants');

/**
 * [function Printer]
 * @param  {[type]} adapter [description]
 * @return {[type]}         [description]
 */
var Printer = function(adapter){
  this.adapter = adapter;
  this.adapter.open();
};

Printer.prototype.print = function(content, callback){
  this.adapter.write(new Buffer(content), callback);
};

Printer.prototype.println = function(content, callback){
  this.print([ content, CONSTANTS.EOL ].join(''));
};

/**
 * [function text]
 * @param  {[type]}   content  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Printer.prototype.text = function(content, callback){
  this.println(content);
};

/**
 * [function description]
 * @param  {[type]} part [description]
 * @return {[type]}      [description]
 */
Printer.prototype.cut = function(part){
  this.print(new Array(6).join(CONSTANTS.EOL));
  this.adapter.write(CONSTANTS.PAPER[
    part ? 'PAPER_PART_CUT' : 'PAPER_FULL_CUT'
  ]);
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

Printer.prototype.align = function(align){
  this.adapter.write(CONSTANTS.TEXT_FORMAT[
    'TXT_ALIGN_' + align.toUpperCase()
  ]);
};

Printer.prototype.font = function(family){
  this.adapter.write(CONSTANTS.TEXT_FORMAT[
    'TXT_FONT_' + family.toUpperCase()
  ]);
};

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


Printer.prototype.size = function(width, height){
  // DEFAULT SIZE: NORMAL
  this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_NORMAL);
  if(width == 2){
    this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_2WIDTH);
  }
  if(height == 2){
    this.adapter.write(CONSTANTS.TEXT_FORMAT.TXT_2HEIGHT);
  }
};

Printer.prototype.hardware = function(hw){
  this.adapter.write(CONSTANTS.HARDWARE[ 'HW_'+ hw ]);
};

module.exports = Printer;
