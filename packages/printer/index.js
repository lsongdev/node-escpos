'use strict';
const util = require('util');
const qr = require('qr-image');
const iconv = require('iconv-lite');
const getPixels = require('get-pixels');
const { MutableBuffer } = require('mutable-buffer');
const EventEmitter = require('events');
const Image = require('./image');
const utils = require('./utils');
const _ = require('./commands');
const Promiseify = require('./promisify');
const statuses = require('./statuses');
const {PrinterStatus,OfflineCauseStatus,ErrorCauseStatus,RollPaperSensorStatus} = statuses;

/**
 * [function ESC/POS Printer]
 * @param  {[Adapter]} adapter [eg: usb, network, or serialport]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
function Printer(adapter, options) {
  if (!(this instanceof Printer)) {
    return new Printer(adapter);
  }
  var self = this;
  EventEmitter.call(this);
  this.adapter = adapter;
  this.options = options;
  this.buffer = new MutableBuffer();
  this.encoding = options && options.encoding || 'GB18030';
  this.width = options && options.width || 48;
  this._model = null;
};

Printer.create = function (device) {
  const printer = new Printer(device);
  return Promise.resolve(Promiseify(printer))
};

/**
 * Printer extends EventEmitter
 */
util.inherits(Printer, EventEmitter);

/**
 * Set printer model to recognize model-specific commands.
 * Supported models: [ null, 'qsprinter' ]
 *
 * For generic printers, set model to null
 *
 * [function set printer model]
 * @param  {[String]}  model [mandatory]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.model = function (_model) {
  this._model = _model;
  return this;
};

/**
 * Set character code table
 * @param  {[Number]} codeTable
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.setCharacterCodeTable = function (codeTable) {
  this.buffer.write(_.ESC);
  this.buffer.write(_.TAB);
  this.buffer.writeUInt8(codeTable);
  return this;
};

/**
 * Fix bottom margin
 * @param  {[String]} size
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.marginBottom = function (size) {
  this.buffer.write(_.MARGINS.BOTTOM);
  this.buffer.writeUInt8(size);
  return this;
};

/**
 * Fix left margin
 * @param  {[String]} size
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.marginLeft = function (size) {
  this.buffer.write(_.MARGINS.LEFT);
  this.buffer.writeUInt8(size);
  return this;
};

/**
 * Fix right margin
 * @param  {[String]} size
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.marginRight = function (size) {
  this.buffer.write(_.MARGINS.RIGHT);
  this.buffer.writeUInt8(size);
  return this;
};

/**
 * [function print]
 * @param  {[String]}  content  [mandatory]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.print = function (content) {
  this.buffer.write(content);
  return this;
};
/**
 * [function print pure content with End Of Line]
 * @param  {[String]}  content  [mandatory]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.println = function (content) {
  return this.print(content + _.EOL);
};

/**
 * [function print pure content with End Of Line]
 * @param  {[String]}  content  [mandatory]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.newLine = function () {
  return this.print(_.EOL);
};

/**
 * [function Print encoded alpha-numeric text with End Of Line]
 * @param  {[String]}  content  [mandatory]
 * @param  {[String]}  encoding [optional]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.text = function (content, encoding) {
  return this.print(iconv.encode(content + _.EOL, encoding || this.encoding));
};


/**
 * [function Print draw line End Of Line]

 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.drawLine = function () {


  // this.newLine();
  for (var i = 0; i < this.width; i++) {
    this.buffer.write(Buffer.from("-"));
  }
  this.newLine();

  return this;
};



/**
 * [function Print  table   with End Of Line]
 * @param  {[List]}  data  [mandatory]
 * @param  {[String]}  encoding [optional]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.table = function (data, encoding) {


  var cellWidth = this.width / data.length;
  var lineTxt = "";

  for (var i = 0; i < data.length; i++) {

    lineTxt += data[i].toString();

    var spaces = cellWidth - data[i].toString().length;
    for (var j = 0; j < spaces; j++) {
      lineTxt += " ";

    }

  }
  this.buffer.write(iconv.encode(lineTxt + _.EOL, encoding || this.encoding));

  return this;



};

/**
 * [function Print  custom table  with End Of Line]
 * @param  {[List]}  data  [mandatory]
 * @param  {[String]}  encoding [optional]
 * @param  {[Array]}  size [optional]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.tableCustom = function (data, options = {}) {
  options = options || { size: [], encoding: this.encoding }
  let [width = 1, height = 1] = options.size || []
  let baseWidth = Math.floor(this.width / width)
  let cellWidth = Math.floor(baseWidth / data.length)
  let leftoverSpace = baseWidth - cellWidth * data.length
  let lineStr = ''
  let secondLineEnabled = false
  let secondLine = []

  for (let i = 0; i < data.length; i++) {
    let obj = data[i]
    let align = (obj.align || '').toUpperCase()
    let tooLong = false

    obj.text = obj.text.toString()
    let textLength = obj.text.length

    if (obj.width) {
      cellWidth = baseWidth * obj.width
    } else if (obj.cols) {
      cellWidth = obj.cols
    }

    if (cellWidth < textLength) {
      tooLong = true
      obj.originalText = obj.text
      obj.text = obj.text.substring(0, cellWidth)
    }

    if (align === 'CENTER') {
      let spaces = (cellWidth - textLength) / 2
      for (let s = 0; s < spaces; s++) {
        lineStr += ' '
      }

      if (obj.text !== '') {
        if (obj.style) {
          lineStr += (
            this._getStyle(obj.style) +
            obj.text +
            this._getStyle("NORMAL")
          )
        } else {
          lineStr += obj.text
        }
      }

      for (let s = 0; s < spaces - 1; s++) {
        lineStr += ' '
      }
    } else if (align === 'RIGHT') {
      let spaces = cellWidth - textLength
      if (leftoverSpace > 0) {
        spaces += leftoverSpace
        leftoverSpace = 0
      }

      for (let s = 0; s < spaces; s++) {
        lineStr += ' '
      }

      if (obj.text !== '') {
        if (obj.style) {
          lineStr += (
            this._getStyle(obj.style) +
            obj.text +
            this._getStyle("NORMAL")
          )
        } else {
          lineStr += obj.text
        }
      }
    } else {
      if (obj.text !== '') {
        if (obj.style) {
          lineStr += (
            this._getStyle(obj.style) +
            obj.text +
            this._getStyle("NORMAL")
          )
        } else {
          lineStr += obj.text
        }
      }

      let spaces = Math.floor(cellWidth - textLength)
      if (leftoverSpace > 0) {
        spaces += leftoverSpace
        leftoverSpace = 0
      }

      for (let s = 0; s < spaces; s++) {
        lineStr += ' '
      }
    }

    if (tooLong) {
      secondLineEnabled = true
      obj.text = obj.originalText.substring(cellWidth)
      secondLine.push(obj)
    } else {
      obj.text = ''
      secondLine.push(obj)
    }
  }

  // Set size to line
  if (width > 1 || height > 1) {
    lineStr = (
      _.TEXT_FORMAT.TXT_CUSTOM_SIZE(width, height) +
      lineStr +
      _.TEXT_FORMAT.TXT_NORMAL
    )
  }

  // Write the line
  this.buffer.write(
    iconv.encode(lineStr + _.EOL, options.encoding || this.encoding)
  )

  if (secondLineEnabled) {
    // Writes second line if has
    return this.tableCustom(secondLine, options)
  } else {
    return this
  }
}


/**
 * [function Print encoded alpha-numeric text without End Of Line]
 * @param  {[String]}  content  [mandatory]
 * @param  {[String]}  encoding [optional]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.pureText = function (content, encoding) {
  return this.print(iconv.encode(content, encoding || this.encoding));
};

/**
 * [function encode text]
 * @param  {[String]}  encoding [mandatory]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.encode = function (encoding) {
  this.encoding = encoding;
  return this;
}

/**
 * [line feed]
 * @param  {[type]}    lines   [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.feed = function (n) {
  this.buffer.write(new Array(n || 1).fill(_.EOL).join(''));
  return this;
};

/**
 * [feed control sequences]
 * @param  {[type]}    ctrl     [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.control = function (ctrl) {
  this.buffer.write(_.FEED_CONTROL_SEQUENCES[
    'CTL_' + ctrl.toUpperCase()
  ]);
  return this;
};
/**
 * [text align]
 * @param  {[type]}    align    [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.align = function (align) {
  this.buffer.write(_.TEXT_FORMAT[
    'TXT_ALIGN_' + align.toUpperCase()
  ]);
  return this;
};
/**
 * [font family]
 * @param  {[type]}    family  [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.font = function (family) {
  this.buffer.write(_.TEXT_FORMAT[
    'TXT_FONT_' + family.toUpperCase()
  ]);
  if (family.toUpperCase() === 'A')
    this.width = this.options && this.options.width || 42;
  else
    this.width = this.options && this.options.width || 56;
  return this;
};

/**
 * [font style]
 * @param  {[type]}    type     [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype._getStyle = function (type) {
  let styled = ''
  switch (type.toUpperCase()) {
    case 'B':
      styled += _.TEXT_FORMAT.TXT_BOLD_ON
      styled += _.TEXT_FORMAT.TXT_ITALIC_OFF
      styled += _.TEXT_FORMAT.TXT_UNDERL_OFF
      break
    case 'I':
      styled += _.TEXT_FORMAT.TXT_BOLD_OFF
      styled += _.TEXT_FORMAT.TXT_ITALIC_ON
      styled += _.TEXT_FORMAT.TXT_UNDERL_OFF
      break
    case 'U':
      styled += _.TEXT_FORMAT.TXT_BOLD_OFF
      styled += _.TEXT_FORMAT.TXT_ITALIC_OFF
      styled += _.TEXT_FORMAT.TXT_UNDERL_ON
      break
    case 'U2':
      styled += _.TEXT_FORMAT.TXT_BOLD_OFF
      styled += _.TEXT_FORMAT.TXT_ITALIC_OFF
      styled += _.TEXT_FORMAT.TXT_UNDERL2_ON
      break

    case 'BI':
      styled += _.TEXT_FORMAT.TXT_BOLD_ON
      styled += _.TEXT_FORMAT.TXT_ITALIC_ON
      styled += _.TEXT_FORMAT.TXT_UNDERL_OFF
      break
    case 'BIU':
      styled += _.TEXT_FORMAT.TXT_BOLD_ON
      styled += _.TEXT_FORMAT.TXT_ITALIC_ON
      styled += _.TEXT_FORMAT.TXT_UNDERL_ON
      break
    case 'BIU2':
      styled += _.TEXT_FORMAT.TXT_BOLD_ON
      styled += _.TEXT_FORMAT.TXT_ITALIC_ON
      styled += _.TEXT_FORMAT.TXT_UNDERL2_ON
      break
    case 'BU':
      styled += _.TEXT_FORMAT.TXT_BOLD_ON
      styled += _.TEXT_FORMAT.TXT_ITALIC_OFF
      styled += _.TEXT_FORMAT.TXT_UNDERL_ON
      break
    case 'BU2':
      styled += _.TEXT_FORMAT.TXT_BOLD_ON
      styled += _.TEXT_FORMAT.TXT_ITALIC_OFF
      styled += _.TEXT_FORMAT.TXT_UNDERL2_ON
      break
    case 'IU':
      styled += _.TEXT_FORMAT.TXT_BOLD_OFF
      styled += _.TEXT_FORMAT.TXT_ITALIC_ON
      styled += _.TEXT_FORMAT.TXT_UNDERL_ON
      break
    case 'IU2':
      styled += _.TEXT_FORMAT.TXT_BOLD_OFF
      styled += _.TEXT_FORMAT.TXT_ITALIC_ON
      styled += _.TEXT_FORMAT.TXT_UNDERL2_ON
      break

    case 'NORMAL':
    default:
      styled += _.TEXT_FORMAT.TXT_BOLD_OFF
      styled += _.TEXT_FORMAT.TXT_ITALIC_OFF
      styled += _.TEXT_FORMAT.TXT_UNDERL_OFF
      break
  }
  return styled
}

/**
 * [font style]
 * @param  {[type]}    type     [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.style = function (type) {
  this.buffer.write(this._getStyle(type));
  return this;
};

/**
 * [font size]
 * @param  {[String]}  width   [description]
 * @param  {[String]}  height  [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.size = function (width, height) {
  
  this.buffer.write(_.TEXT_FORMAT.TXT_CUSTOM_SIZE(width, height));

  return this;
};

/**
 * [set character spacing]
 * @param  {[type]}    n     [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.spacing = function (n) {
  if (n === undefined || n === null) {
    this.buffer.write(_.CHARACTER_SPACING.CS_DEFAULT);
  } else {
    this.buffer.write(_.CHARACTER_SPACING.CS_SET);
    this.buffer.writeUInt8(n);
  }
  return this;
}

/**
 * [set line spacing]
 * @param  {[type]} n [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.lineSpace = function (n) {
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
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.hardware = function (hw) {
  this.buffer.write(_.HARDWARE['HW_' + hw.toUpperCase()]);
  return this;
};
/**
 * [barcode]
 * @param  {[type]}    code     [description]
 * @param  {[type]}    type     [description]
 * @param  {[type]}    options  [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.barcode = function (code, type, options) {
  options = options || {};
  var width, height, position, font, includeParity;
  // Backward compatibility
  width = arguments[2];
  if (typeof width === 'string' || typeof width === 'number') {
    width = arguments[2];
    height = arguments[3];
    position = arguments[4];
    font = arguments[5];
  } else {
    width = options.width;
    height = options.height;
    position = options.position;
    font = options.font;
    includeParity = options.includeParity !== false; // true by default
  }

  type = type || 'EAN13'; // default type is EAN13, may a good choice ?
  var convertCode = String(code), parityBit = '', codeLength = '';
  if (typeof type === 'undefined' || type === null) {
    throw new TypeError('barcode type is required');
  }
  if (type === 'EAN13' && convertCode.length !== 12) {
    throw new Error('EAN13 Barcode type requires code length 12');
  }
  if (type === 'EAN8' && convertCode.length !== 7) {
    throw new Error('EAN8 Barcode type requires code length 7');
  }
  if (this._model === 'qsprinter') {
    this.buffer.write(_.MODEL.QSPRINTER.BARCODE_MODE.ON);
  }
  if (this._model === 'qsprinter') {
    // qsprinter has no BARCODE_WIDTH command (as of v7.5)
  } else if (width >= 1 && width <= 5) {
    this.buffer.write(_.BARCODE_FORMAT.BARCODE_WIDTH[width]);
  } else {
    this.buffer.write(_.BARCODE_FORMAT.BARCODE_WIDTH_DEFAULT);
  }
  if (height >= 1 && height <= 255) {
    this.buffer.write(_.BARCODE_FORMAT.BARCODE_HEIGHT(height));
  } else {
    if (this._model === 'qsprinter') {
      this.buffer.write(_.MODEL.QSPRINTER.BARCODE_HEIGHT_DEFAULT);
    } else {
      this.buffer.write(_.BARCODE_FORMAT.BARCODE_HEIGHT_DEFAULT);
    }
  }
  if (this._model === 'qsprinter') {
    // Qsprinter has no barcode font
  } else {
    this.buffer.write(_.BARCODE_FORMAT[
      'BARCODE_FONT_' + (font || 'A').toUpperCase()
    ]);
  }
  this.buffer.write(_.BARCODE_FORMAT[
    'BARCODE_TXT_' + (position || 'BLW').toUpperCase()
  ]);
  this.buffer.write(_.BARCODE_FORMAT[
    'BARCODE_' + ((type || 'EAN13').replace('-', '_').toUpperCase())
  ]);
  if (includeParity) {
    if (type === 'EAN13' || type === 'EAN8') {
      parityBit = utils.getParityBit(code);
    }
  }
  if (type == 'CODE128' || type == 'CODE93') {
    codeLength = utils.codeLength(code);
  }
  this.buffer.write(codeLength + code + (includeParity ? parityBit : '') + '\x00'); // Allow to skip the parity byte
  if (this._model === 'qsprinter') {
    this.buffer.write(_.MODEL.QSPRINTER.BARCODE_MODE.OFF);
  }
  return this;
};

/**
 * [print qrcode]
 * @param  {[type]} code    [description]
 * @param  {[type]} version [description]
 * @param  {[type]} level   [description]
 * @param  {[type]} size    [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.qrcode = function (code, version, level, size) {
  if (this._model !== 'qsprinter') {
    this.buffer.write(_.CODE2D_FORMAT.TYPE_QR);
    this.buffer.write(_.CODE2D_FORMAT.CODE2D);
    this.buffer.writeUInt8(version || 3);
    this.buffer.write(_.CODE2D_FORMAT[
      'QR_LEVEL_' + (level || 'L').toUpperCase()
    ]);
    this.buffer.writeUInt8(size || 6);
    this.buffer.writeUInt16LE(code.length);
    this.buffer.write(code);
  } else {
    const dataRaw = iconv.encode(code, 'utf8');
    if (dataRaw.length < 1 && dataRaw.length > 2710) {
      throw new Error('Invalid code length in byte. Must be between 1 and 2710');
    }

    // Set pixel size
    if (!size || (size && typeof size !== 'number'))
      size = _.MODEL.QSPRINTER.CODE2D_FORMAT.PIXEL_SIZE.DEFAULT;
    else if (size && size < _.MODEL.QSPRINTER.CODE2D_FORMAT.PIXEL_SIZE.MIN)
      size = _.MODEL.QSPRINTER.CODE2D_FORMAT.PIXEL_SIZE.MIN;
    else if (size && size > _.MODEL.QSPRINTER.CODE2D_FORMAT.PIXEL_SIZE.MAX)
      size = _.MODEL.QSPRINTER.CODE2D_FORMAT.PIXEL_SIZE.MAX;
    this.buffer.write(_.MODEL.QSPRINTER.CODE2D_FORMAT.PIXEL_SIZE.CMD);
    this.buffer.writeUInt8(size);

    // Set version
    if (!version || (version && typeof version !== 'number'))
      version = _.MODEL.QSPRINTER.CODE2D_FORMAT.VERSION.DEFAULT;
    else if (version && version < _.MODEL.QSPRINTER.CODE2D_FORMAT.VERSION.MIN)
      version = _.MODEL.QSPRINTER.CODE2D_FORMAT.VERSION.MIN;
    else if (version && version > _.MODEL.QSPRINTER.CODE2D_FORMAT.VERSION.MAX)
      version = _.MODEL.QSPRINTER.CODE2D_FORMAT.VERSION.MAX;
    this.buffer.write(_.MODEL.QSPRINTER.CODE2D_FORMAT.VERSION.CMD);
    this.buffer.writeUInt8(version);

    // Set level
    if (!level || (level && typeof level !== 'string'))
      level = _.CODE2D_FORMAT.QR_LEVEL_L;
    this.buffer.write(_.MODEL.QSPRINTER.CODE2D_FORMAT.LEVEL.CMD);
    this.buffer.write(_.MODEL.QSPRINTER.CODE2D_FORMAT.LEVEL.OPTIONS[level.toUpperCase()]);

    // Transfer data(code) to buffer
    this.buffer.write(_.MODEL.QSPRINTER.CODE2D_FORMAT.SAVEBUF.CMD_P1);
    this.buffer.writeUInt16LE(dataRaw.length + _.MODEL.QSPRINTER.CODE2D_FORMAT.LEN_OFFSET);
    this.buffer.write(_.MODEL.QSPRINTER.CODE2D_FORMAT.SAVEBUF.CMD_P2);
    this.buffer.write(dataRaw);

    // Print from buffer
    this.buffer.write(_.MODEL.QSPRINTER.CODE2D_FORMAT.PRINTBUF.CMD_P1);
    this.buffer.writeUInt16LE(dataRaw.length + _.MODEL.QSPRINTER.CODE2D_FORMAT.LEN_OFFSET);
    this.buffer.write(_.MODEL.QSPRINTER.CODE2D_FORMAT.PRINTBUF.CMD_P2);
  }
  return this;
};

/**
 * [print qrcode image]
 * @param  {[type]}   content  [description]
 * @param  {[type]}   options  [description]
 * @param  {[Function]} callback [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.qrimage = function (content, options, callback) {
  var self = this;
  if (typeof options == 'function') {
    callback = options;
    options = null;
  }
  options = options || { type: 'png', mode: 'dhdw' };
  var buffer = qr.imageSync(content, options);
  var type = ['image', options.type].join('/');
  getPixels(buffer, type, function (err, pixels) {
    if (err) return callback && callback(err);
    self.raster(new Image(pixels), options.mode);
    callback && callback.call(self, null, self);
  });
  return this;
};

/**
 * [image description]
 * @param  {[type]} image   [description]
 * @param  {[type]} density [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.image = async function (image, density) {
  if (!(image instanceof Image))
    throw new TypeError('Only escpos.Image supported');
  density = density || 'd24';
  var n = !!~['d8', 's8'].indexOf(density) ? 1 : 3;
  var header = _.BITMAP_FORMAT['BITMAP_' + density.toUpperCase()];
  var bitmap = image.toBitmap(n * 8);
  var self = this;

  // added a delay so the printer can process the graphical data
  // when connected via slower connection ( e.g.: Serial)
  this.lineSpace(0); // set line spacing to 0
  bitmap.data.forEach(async (line) => {
    self.buffer.write(header);
    self.buffer.writeUInt16LE(line.length / n);
    self.buffer.write(line);
    self.buffer.write(_.EOL);
    await new Promise((resolve, reject) => {
      setTimeout(() => { resolve(true) }, 200);
    });
  });
  return this.lineSpace();
};

/**
 * [raster description]
 * @param  {[type]} image [description]
 * @param  {[type]} mode  [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.raster = function (image, mode) {
  if (!(image instanceof Image))
    throw new TypeError('Only escpos.Image supported');
  mode = mode || 'normal';
  if (mode === 'dhdw' ||
    mode === 'dwh' ||
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
 * [function Send pulse to kick the cash drawer]
 * @param  {[type]} pin [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.cashdraw = function (pin) {
  this.buffer.write(_.CASH_DRAWER[
    'CD_KICK_' + (pin || 2)
  ]);
  return this;
};

/**
 * Printer Buzzer (Beep sound)
 * @param  {[Number]} n Refers to the number of buzzer times
 * @param  {[Number]} t Refers to the buzzer sound length in (t * 100) milliseconds.
 */
Printer.prototype.beep = function (n, t) {
  this.buffer.write(_.BEEP);
  this.buffer.writeUInt8(n);
  this.buffer.writeUInt8(t);
  return this;
};

/**
 * Send data to hardware and flush buffer
 * @param  {Function} callback
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.flush = function (callback) {
  var buf = this.buffer.flush();
  this.adapter.write(buf, callback);
  return this;
};

/**
 * [function Cut paper]
 * @param  {[type]} part [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.cut = function (part, feed) {
  this.feed(feed || 3);
  this.buffer.write(_.PAPER[
    part ? 'PAPER_PART_CUT' : 'PAPER_FULL_CUT'
  ]);
  return this;
};

/**
 * [close description]
 * @param  {Function} callback [description]
 * @param  {[type]}   options  [description]
 * @return {[type]}            [description]
 */
Printer.prototype.close = function (callback, options) {
  var self = this;
  return this.flush(function () {
    self.adapter.close(callback, options);
  });
};

/**
 * [color select between two print color modes, if your printer supports it]
 * @param  {Number} color - 0 for primary color (black) 1 for secondary color (red)
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.color = function (color) {
  this.buffer.write(_.COLOR[
    color === 0 || color === 1 ? color : 0
  ]);
  return this;
};

/**
 * [reverse colors, if your printer supports it]
 * @param {Boolean} bool - True for reverse, false otherwise
 * @return {[Printer]} printer  [the escpos printer instance]
 */
Printer.prototype.setReverseColors = function (bool) {
  this.buffer.write(bool ? _.COLOR.REVERSE : _.COLOR.UNREVERSE);
  return this;
};


/**
 * [writes a low level command to the printer buffer]
 *
 * @usage
 * 1) raw('1d:77:06:1d:6b:02:32:32:30:30:30:30:32:30:30:30:35:30:35:00:0a')
 * 2) raw('1d 77 06 1d 6b 02 32 32 30 30 30 30 32 30 30 30 35 30 35 00 0a')
 * 3) raw(Buffer.from('1d77061d6b0232323030303032303030353035000a','hex'))
 *
 * @param data {Buffer|string}
 * @returns {Printer}
 */
Printer.prototype.raw = function raw(data) {
  if (Buffer.isBuffer(data)) {
    this.buffer.write(data);
  } else if (typeof data === 'string') {
    data = data.toLowerCase();
    this.buffer.write(Buffer.from(data.replace(/(\s|:)/g, ''), 'hex'));
  }
  return this;
};


/**
 * get one specific status from the printer
 * @param  {string} statusClassName
 * @param  {Function} callback
 * @return {Printer}
 */
Printer.prototype.getStatus = function(statusClassName, callback) {
  this.adapter.read(data => {
    const byte = data.readInt8(0);

    const status = new statuses[statusClassName](byte);

    callback(status);
  })

  statuses[statusClassName].commands().forEach((c) => {
    this.buffer.write(c);
  });

  return this;
}


/**
 * get statuses from the printer
 * @param  {Function} callback
 * @return {Printer}
 */
Printer.prototype.getStatuses = function(callback) {
  let buffer = [];
  this.adapter.read(data => {
    for (let i = 0; i < data.byteLength; i++) {
      buffer.push(data.readInt8(i));
    }

    if (buffer.length < 4) {
      return;
    }

    let statuses = [];
    for (let i = 0; i < buffer.length; i++) {
      let byte = buffer[i];
      switch (i) {
        case 0:
          statuses.push(new PrinterStatus(byte));
          break;
        case 1:
          statuses.push(new RollPaperSensorStatus(byte));
          break;
        case 2:
          statuses.push(new OfflineCauseStatus(byte));
          break;
        case 3  :
          statuses.push(new ErrorCauseStatus(byte));
          break;
      }
    }

    buffer = [];
    callback(statuses);
  })

  PrinterStatus.commands().forEach((c) => {
    this.adapter.write(c);
  });

  RollPaperSensorStatus.commands().forEach((c) => {
    this.adapter.write(c);
  });

  OfflineCauseStatus.commands().forEach((c) => {
    this.adapter.write(c);
  });

  ErrorCauseStatus.commands().forEach((c) => {
    this.adapter.write(c);
  });

  return this;
}


/**
 * Printer Supports
 */
Printer.Printer = Printer;
Printer.Image = require('./image');
Printer.command = require('./commands');
Printer.Printer2 = require('./promisify');

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = Printer;
