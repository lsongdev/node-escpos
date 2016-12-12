'use strict';
const escpos = require('../');

const device  = new escpos.USB();
const printer = new escpos.Printer(device);

device.openAll(function(){
  let devices = device.getDevices();

  for(let i = 0; i < devices; i++) {
    console.log('Printing on device', (i+1));
    setTimeout(function() {
      device.setDevice(i);
      printer.font('a')
             .align('ct')
             .style('bu')
             .size(1, 1)
             .text('This is the printer #' + (i+1))
             .cut();
    }, 500*i);
  }

  setTimeout(function() {
    device.closeAll(function() {
      console.log('Closed all');
    })
  }, 1000*devices);
});
