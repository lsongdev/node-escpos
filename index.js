'use strict';
/**
 * Adapters
 */

 try {
    exports.USB     = require('./adapter/usb');
} catch(e) {}

 try {
    exports.Serial  = require('./adapter/serial');
} catch(e) {}

 try {
    exports.Network = require('./adapter/network');
    exports.Bluetooth = require('./adapter/bluetooth');
    exports.RawBT   = require('./adapter/rawbt');
} catch (e) {}

exports.Console = require('./adapter/console');

/**
 * Printer Supports
 */
try {
    exports.Image    = require('./image');
} catch(e) {}

exports.Server   = require('./server');
exports.Printer  = require('./printer');
exports.Screen  = require('./screen');
exports.Adapter  = require('./adapter');
exports.command  = require('./commands');
exports.Printer2 = require('./promiseify');

/**
 * Printers Implementations
 */

exports.DarumaGeneric = require('./implementations/daruma');
