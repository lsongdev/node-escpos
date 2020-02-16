'use strict';
const path = require('path');
const escpos = require('../');

const {device, printer} = require('./config');

const tux = path.join(__dirname, 'tux.png');
escpos.Image.load(tux, async function(image){

  device.open(async function(){

    await printer
    .align('lt')

    .raster(image, 'normal');

    await printer
    .align('ct')

    .raster(image, 'normal');

    await printer
    .align('rt')

    .raster(image, 'normal');

    printer.reset().align('ct').text("Now using image instead of raster").feed(2);

    await printer
    .align('lt')

    .image(image, 'd24');

    await printer
    .align('ct')

    .image(image, 'd24');

    await printer
    .align('rt')

    .image(image, 'd24');

    printer
    .cut()
    .close();

  });

});
