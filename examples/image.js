'use strict';
const path = require('path');
const escpos = require('../');

const device  = new escpos.USB();
const printer = new escpos.Printer(device);

const tux = path.join(__dirname, 'tux.png');
escpos.Image.load(tux, function(image){

  device.open(function(){

    printer.align('ct');

    printer.image(image, 's8');
    printer.image(image, 'd8');
    printer.image(image, 's24');
    printer.image(image, 'd24');
    
    printer.raster(image);
    printer.raster(image, 'dw');
    printer.raster(image, 'dh');
    printer.raster(image, 'dwdh');

    printer.cut()
           .close();
  
  });

});