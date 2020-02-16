'use strict';
const escpos = require('../');

const {device, printer} = require('./config');

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
  .cut()
  .close()
});
