'use strict';
const escpos = require('../');
const path = require('path');

const device  = new escpos.Serial('COM9', { baudRate: 9600, autoOpen: false });
// const device  = new escpos.RawBT();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');
const printer = new escpos.Printer(device);

device.open(function(err){
  printer
    .encode('cp866')
    .setCharacterCodeTable(17)
    .text('Тест на кирилица.')
    .size(1, 1)
    .feed()
    .feed()
    .cut()
    .close();
});