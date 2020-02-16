'use strict';
const escpos = require('../');
const path = require('path');

const {device, printer} = require('./config');

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
