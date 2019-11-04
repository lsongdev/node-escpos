'use strict';
const escpos = require('../');

const device  = new escpos.USB();

const printer = new escpos.Printer(device);

device.open(function() {
  printer
  .font('a')
  .align('ct')
  .size(1, 1)
  .text('EAN13 barcode example')
  .barcode('123456789012', 'EAN13') // code length 12
  .barcode('109876543210') // default type 'EAN13'
  .barcode('7654321', 'EAN8') // The EAN parity bit is automatically added.
  .cut()
  .close();
});
