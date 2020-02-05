'use strict';
/**
 * Adapters
 */

 try {
    exports.USB     = require('./adapter/usb');
    exports.Serial  = require('./adapter/serial');
    exports.Network = require('./adapter/network');
    exports.Console = require('./adapter/console');
    exports.Bluetooth = require('./adapter/bluetooth');
    exports.RawBT   = require('./adapter/rawbt');
} catch (e) {
    //This enables react-native support;
}

/**
 * Printer Supports
 */
exports.Image    = require('./image');
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
