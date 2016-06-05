'use strict';
const escpos = require('../');

const device  = new escpos.USB();
const printer = new escpos.Printer(device);

escpos.Image.load(__dirname + '/tux.png', function(image){

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

    .cut();
  
  });

});