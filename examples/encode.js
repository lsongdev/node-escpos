const escpos = require('../');

const device  = new escpos.USB();
// const device  = new escpos.RawBT();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');
const printer = new escpos.Printer(device);

device.open(function(err){

  printer
  .font('a')
  .align('ct')
  .size(1, 1)
  .text('敏捷的棕色狐狸跳过懒狗') // default encoding set is GB18030
  .encode('EUC-KR') // set encode globally
  .text('동해물과 백두산이 마르고 닳도록')
  .text('こんにちは', 'EUC-JP') // set encode functional
  .cut()
  .close();
});
