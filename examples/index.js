var escpos = require('../');

var device  = new escpos.USB();
var printer = new escpos.Printer(device);

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
  });

});
