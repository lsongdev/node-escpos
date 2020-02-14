'use strict';
const path = require('path');
const escpos = require('../');

const device  = new escpos.USB();
const printer = new escpos.Printer(device);

const tux = path.join(__dirname, 'tux.png');
escpos.Image.load(tux, function(image){

  device.open(function(){

    printer.align('ct')
           .image(image, 's8')
           .then(() => { 
              printer.cut().close(); 
           });

    // OR non-async .raster(image, "mode") : printer.text("text").raster(image).cut().close();

  });

});