'use strict';
const path = require('path');
const escpos = require('../');

const device  = new escpos.USB();
const printer = new escpos.Printer(device);


const tux = path.join(__dirname, 'tux.png');
escpos.Image.load(tux, function(image){

  device.open(function(){

    printer
    .align('ct')

    .image(image, 's8')
    .image(image, 'd8')
    .image(image, 's24')
    .image(image, 'd24')
    
    .raster(image)
    .raster(image, 'dw')
    .raster(image, 'dh')
    .raster(image, 'dwdh')

    .cut()
    .close();
  
  });

});
