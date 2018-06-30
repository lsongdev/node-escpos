'use strict';
const escpos = require('../../../');

//const device  = new escpos.USB(0x0416, 0x5011);
// const device  = new escpos.Network('localhost');
const device  = new escpos.Serial('/dev/cu.usbmodem1D141', {
    baudRate: 9600,
    autoOpen: false,
    rtscts: true,
    dataBits: 8,
    stopBits: 1,
    parity: 'none'
});
//const device = new escpos.Console((data) => {
//    console.log([data.toString()]);
//})
const printer = new escpos.DarumaGeneric(device);

device.open(function(err){
    printer
        .reset()
        .align('ct')
        .style('bu')
        .size(2, 1)
        .text('COMANDA 01')
        .feed(1)
        .reset()
        .style('b')
        .pureText('Data: ')
        .style('NORMAL')
        .text(`${(new Date()).toLocaleDateString('en-US')}`)
        .reset()
        .cut(false, 6)
        .close();
});
