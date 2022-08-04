'use strict';
const escpos = require('..');

// const device  = new escpos.USB(0x0416, 0x5011);
// const device  = new escpos.RawBT();
const device  = new escpos.Network('STARPrinterIPAddress');
// const device  = new escpos.Serial('/dev/usb/lp0');
const printer = new escpos.Printer(device);

device.open(function(err){
  printer
  .font('a')
  .align("STAR_CA")
  .style('bu')
  .size(1, 1)
  .emphasize()
  .text('The quick brown fox jumps over the lazy dog')
  .cancelEmphasize()
  .align("STAR_LA")
  .text('敏捷的棕色狐狸跳过懒狗')
  .align("STAR_RA")
  .barcode('1234567', 'EAN8')
  .qrimage('https://github.com/song940/node-escpos', function(err){
    this.fullCut()
    this.close();
  });
});
