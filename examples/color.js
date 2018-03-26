'use strict';
const escpos = require('../');

// const device  = new escpos.USB(0x0416, 0x5011);
const device  = new escpos.Network('192.168.0.90');
// const device  = new escpos.Serial('/dev/usb/lp0');
const printer = new escpos.Printer(device);

device.open(function(err){

  printer
  .hardware('init')
  .font('a')
  .align('ct')
  .style('bu')
  .size(1, 1)
  .text('The quick brown fox jumps over the lazy dog')
  .color(1)
  .text('This line should be red')
  .color(0)
  .text('This line should be back to black')
  .color(1)
  .text('This line should be red')
  .close()
});

