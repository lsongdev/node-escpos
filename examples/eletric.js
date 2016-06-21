'use strict';
const escpos = require('../');

const device  = new escpos.USB();
const printer = new escpos.Printer(device);

device.open(function(){

  printer
  .font('a')
  .align('ct')
  .style('bu')
  .size(1, 1)
  .text('测试')
  .println()
  .text('------')
  .text('欢迎使用「微信支付」向我付款')
  .qrimage('http://w.url.cn/s/AYtC8WU', function(err){

    this
    .println()
    .text('185-1010-0102')
    .text('hi@lsong.org')
    .text('https://lsong.org')
    .cut();
  });

});
