'use strict';
const escpos = require('../');

const config = require('./config');
const device  = config.device;
const printer = config.printer;

device.open(async function() {
  printer
  .font('a')
  .align('ct')
  .style('bu')
  .feed()
  .text('UPCA barcode example')
  .barcode('12345678901', 'UPC_A') // code length 11

  .feed()
  .text('UPCE barcode example')
  .barcode('12345678901', 'UPC_E') // code length 11

  .feed()
  .text('EAN13 barcode example')
  .barcode('123456789012', 'EAN13') // code length 12

  .feed()
  .text('EAN8 barcode example')
  .barcode('1234567', 'EAN8') // code length 7

  .feed()
  .text('QRCode example');

  await printer.qrimage('https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode', {mode: 'normal'})

  printer.cut()
  .close();
});
