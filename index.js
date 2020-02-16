'use strict';
/**
 * Adapters
 */

 try {
    exports.USB     = require('./adapter/usb');
} catch(e) {
    console.warn("USB adapters disabled");
}

 try {
    exports.Serial  = require('./adapter/serial');
} catch(e) {
    console.warn("Serial adapters disabled");
}

try {
    exports.Bluetooth = require('./adapter/bluetooth');
    exports.RawBT   = require('./adapter/rawbt');
} catch (e) {
    console.warn("Bluetooth adapters disabled");
}

try {
    exports.Network = require('./adapter/network');
} catch(e) {
    console.warn("Network adapters disabled");
}

exports.Console = require('./adapter/console');
exports.FileDumper = require('./adapter/filedumper');

/**
 * Printer Supports
 */
try {
    exports.Image    = require('./image');
} catch(e) {
    console.warn("Image helpers disabled");
}

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
exports.BematechGeneric = require('./implementations/bematech');
