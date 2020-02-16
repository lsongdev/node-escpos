const escpos = require('../');

const {device, printer} = require('./config');

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
