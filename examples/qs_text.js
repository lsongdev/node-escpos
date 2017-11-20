'use strict';
const escpos = require('../');

const device  = new escpos.USB(0x0485, 0x7541);
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');
const printer = new escpos.Printer(device);

device.open(function(err){

  printer
  .model('qsprinter')
  .font('a')
  .align('ct')
  .style('bu')
  .size(1, 1)
  .encode('tis620')
  .text('The quick brown fox jumps over the lazy dog')
  .text('สวัสดีภาษาไทย')
  .close();
  // .text('敏捷的棕色狐狸跳过懒狗')
  // .barcode('1234567', 'EAN8')
  // .qrimage('https://github.com/song940/node-escpos', function(err){
  //   this.cut();
  //   this.close();
  // });

});
