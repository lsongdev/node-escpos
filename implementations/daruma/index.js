'use strict';

const genericCommands = require('../../commands');
const Printer = require('../../printer');
const Promiseify = require('../../promiseify');
const mergeOptions = require('merge-options');

const darumaCommands = mergeOptions(genericCommands, {
    BEEP: '\x1b\x07',
    RESET: '\x1b\x40',
    TEXT_FORMAT: {
        TXT_ALIGN_LT: '\x1b\x6A\x00', // Left justification
        TXT_ALIGN_CT: '\x1b\x6A\x01', // Centering
        TXT_ALIGN_RT: '\x1b\x6A\x02', // Right justification

        TXT_NORMAL: '\x1b\x14',
        TXT_2WIDTH: '\x1b\x0e',
        TXT_2HEIGHT: '\x1b\x77',
        TXT_4SQUARE: '\x1b\x0e',
        TXT_BOLD_ON: '\x1b\x45',
        TXT_BOLD_OFF: '\x1b\x46',
        TXT_UNDERL_OFF: '\x1b\x2d\x00', // Underline font OFF
        TXT_UNDERL_ON: '\x1b\x2d\x01', // Underline font 1-dot ON
        TXT_UNDERL2_ON: '\x1b\x2d\x02', // Underline font 2-dot ON
        TXT_ITALIC_OFF: '\x1b\x34\x00', // Italic font ON
        TXT_ITALIC_ON: '\x1b\x34\x01', // Italic font ON

        TXT_FONT_A: '\x1b\x21\x00\x00',
        TXT_FONT_B: '\x1b\x21\x00\x01',
    },
    GSV0_FORMAT: {
        GSV0_NORMAL: '\x10\x58\x00',
        GSV0_DW: '\x10\x58\x01',
        GSV0_DH: '\x10\x58\x02',
        GSV0_DWDH: '\x10\x58\x03'
    }
});

const BARCODE_NORMAL_WIDTH = 1;
const BARCODE_DOUBLE_WIDTH = 2;
const BARCODE_QUADRUPLE_WIDTH = 3;

const BARCODE_HRI_NONE = 0;
const BARCODE_HRI_TOP = 1;
const BARCODE_HRI_BOTTOM = 2;
const BARCODE_HRI_BOTH = 3;

const QRCODE_MODULE_SIZE_4 = 4
const QRCODE_MODULE_SIZE_5 = 5
const QRCODE_MODULE_SIZE_6 = 6
const QRCODE_MODULE_SIZE_7 = 7
const QRCODE_MODULE_SIZE_8 = 8

const QRCODE_ERROR_CORRECTION_L = 'L';
const QRCODE_ERROR_CORRECTION_M = 'M';
const QRCODE_ERROR_CORRECTION_Q = 'Q';
const QRCODE_ERROR_CORRECTION_H = 'H';

const _QRCODE_MAX_DATA_SIZE = 700
const _QRCODE_ECC_LEVEL_AUTO = 0
const _QRCODE_MODULE_SIZE_AUTO = 7

class DarumaGeneric extends Printer {
    constructor(adapter, options) {
        super(adapter, options, darumaCommands);
    }

    reset() {
        this.buffer.write(this.printerCommands.RESET);
        return this;
    }

    barcode (code, type, options) {
        var _translate_barcode_height = function(height) {
            return height < 50 ? 50 : height;
        }

        var _translate_barcode_width = function(width) {
            const values = {
                BARCODE_NORMAL_WIDTH: 2,
                BARCODE_DOUBLE_WIDTH: 3,
                BARCODE_QUADRUPLE_WIDTH: 5
            };

            return values[width];
        }

        var _translate_barcode_hri = function(hri) {
            const values = {
                BARCODE_HRI_NONE: 0,
                BARCODE_HRI_TOP: 0,
                BARCODE_HRI_BOTTOM: 1,
                BARCODE_HRI_BOTH: 0,
            }

            return values[hri];
        }

        var _translate_barcode_format = function(type) {
            const values = {
                'EAN13':       1,
                'EAN8':        2,
                'S2OF5':       3,
                'I2OF5':       4,
                'CODE128':     5,
                'CODE39':      6,
                'CODE93':      7,
                'UPC_A':       8,
                'CODABAR':     9,
                'MSI':         10,
                'CODE11':      11,
            }

            return values[type];
        }

        options = options || {};
        var width, height, position, font, includeParity;

        if (typeof width === 'string' || typeof width === 'number') { // That's because we are not using the options.object
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

        var barcode_height = _translate_barcode_height(height || 50);
        var barcode_width = _translate_barcode_width(width || BARCODE_NORMAL_WIDTH);
        var barcode_position = _translate_barcode_hri(position || BARCODE_HRI_NONE);
        var barcode_type = _translate_barcode_format(type);

        this.buffer.write('\x1B\x62');
        this.buffer.writeUInt8(barcode_type);
        this.buffer.writeUInt8(barcode_width);
        this.buffer.writeUInt8(barcode_height);
        this.buffer.writeUInt8(barcode_position);
        this.buffer.write(code);
        this.buffer.write('\x00');

        return this;
    }

    /**
    * [print qrcode]
    * @param  {[type]} code    [description]
    * @param  {[type]} version [description]
    * @param  {[type]} level   [description]
    * @param  {[type]} size    [description]
    * @return {[Printer]} printer  [the escpos printer instance]
    */
    qrcode (code, level, size, callback) {
        var _translate_qrcode_ecc_level = function(level) {
            var values = {
                QRCODE_ERROR_CORRECTION_L: 77,
                QRCODE_ERROR_CORRECTION_M: 77,
                QRCODE_ERROR_CORRECTION_Q: 81,
                QRCODE_ERROR_CORRECTION_H: 72
            }

            return values[level];
        }

        var _translate_qrcode_module_size = function(size) {
            var values = {
                QRCODE_MODULE_SIZE_4: 4,
                QRCODE_MODULE_SIZE_5: 5,
                QRCODE_MODULE_SIZE_6: 6,
                QRCODE_MODULE_SIZE_7: 7,
                QRCODE_MODULE_SIZE_8: 7
            }

            return values[level];
        }

        var ecc_level = _translate_qrcode_ecc_level(level) || _QRCODE_ECC_LEVEL_AUTO;
        var _size = _translate_qrcode_module_size(size) || _QRCODE_MODULE_SIZE_AUTO;
        var data_length = `${code}`.length;

        if ( data_length > _QRCODE_MAX_DATA_SIZE ) {
            throw 'Too much data';
        }

        var size_L = data_length >> 8;
        var size_H = (data_length & 255) + 2;

        this.adapter.write('\x1b\x81');
        this.buffer.writeUInt8(size_H);
        this.buffer.writeUInt8(size_L);
        this.buffer.writeUInt8(_size)
        this.buffer.writeUInt8(ecc_level);
        this.buffer.write(code);

        return this;
    };

    /**
     * [set character spacing]
     * @param  {[type]}    n     [description]
     * @return {[Printer]} printer  [the escpos printer instance]
     */
    spacing (n) {
      return this;
    }

    /**
     * Printer Buzzer (Beep sound)
     * @param  {[String]} n Refers to the number of buzzer times
     * @param  {[String]} t Refers to the buzzer sound length in (t * 100) milliseconds.
     */
    beep (n, t) {
      this.buffer.write(this.printerCommands.BEEP);
      return this;
    };

    cut (part, feed) {
      this.feed(feed || 3);
      this.buffer.write('\x1b\x6d');

      return this;
    }
}

DarumaGeneric.create = function (device) {
  const printer = new DarumaGeneric(device);
  return Promise.resolve(Promiseify(printer))
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = DarumaGeneric;
