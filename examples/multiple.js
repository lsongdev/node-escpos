'use strict';
const escpos = require('..');

const devices = escpos.USB.findPrinter();
const network = new escpos.Network('localhost');
const lp0     = new escpos.Serial('/dev/usb/lp0');
const usb     = escpos.USB(0x01, 0xff);

const printer = new escpos.Printer([
  devices[1],
  devices[3],
  network,
  lp0,
  usb
]);

device.open(function(){

  printer
  .font('a')
  .align('ct')
  .style('bu')
  .size(1, 1)
  .text('The quick brown fox jumps over the lazy dog')
  .text('敏捷的棕色狐狸跳过懒狗')
  .barcode('12345678', 'EAN8')
  .qrimage('https://github.com/song940/node-escpos', function(err){
    this.cut();
    this.close();
  });

});