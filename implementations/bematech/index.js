'use strict';

const genericCommands = require('../../commands');
const Printer = require('../../printer');
const Promiseify = require('../../promiseify');
const mergeOptions = require('merge-options');

const bematechCommands = mergeOptions(genericCommands, {
    PAPER: {
        PAPER_FULL_CUT: '\x1b\x69', // Full cut paper
        PAPER_PART_CUT: '\x1b\x6d', // Partial cut paper
        PAPER_CUT_A: '\x1b\x6d', // Partial cut paper
        PAPER_CUT_B: '\x1b\x6d', // Partial cut paper
    },
    TEXT_FORMAT: {
        TXT_ALIGN_LT: '\x1b\x61\x00', // Left justification
        TXT_ALIGN_CT: '\x1b\x61\x01', // Centering
        TXT_ALIGN_RT: '\x1b\x61\x02', // Right justification
        TXT_2HEIGHT: '\x1b\x64\x31', // Double height text
        TXT_2WIDTH: '\x1b\x57\x31', // Double width text
        TXT_4SQUARE: '\x1b\x57\x31\x1b\x64\x31', // Double width & height text
    },
    BITMAP_FORMAT: {
        BITMAP_S8: '\x1b\x4b',
        BITMAP_D8: '\x1b\x4b',
        BITMAP_S24: '\x1b\x2a\x21',
        BITMAP_D24: '\x1b\x2a\x21'
    }
});

class BematechGeneric extends Printer {
    constructor(adapter, options) {
        super(adapter, options, bematechCommands);
    }

    reset() {
        this.buffer.write(this.printerCommands.HARDWARE.HW_INIT);

        return this;
    }

    //Extracted from pyescpos bematech.py implementation
    qrcode(code, version, level, size) {
        this.commandBlock(() => {
            let _qr_size_param_0 = 3
            let _qr_size_param_1 = 8
            let _qr_size_param_2 = 8
            let _qr_size_param_3 = 1

            let size_H = ~~(code.length / 256);
            let size_L = code.length % 256;

            let command = '\x1D\x6B\x51' +
                    String.fromCharCode(
                        _qr_size_param_0,
                        _qr_size_param_1,
                        _qr_size_param_2,
                        _qr_size_param_3,
                        size_L, size_H
                    ) + code

            this.buffer.write(command)
        });

        return this;
    }

    barcode(code, type, options) {
        return super.barcode(code, type, {
            includeParity: false,
            ...options
        })
    }
}


BematechGeneric.create = function (device) {
  const printer = new BematechGeneric(device);
  return Promise.resolve(Promiseify(printer))
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = BematechGeneric;
