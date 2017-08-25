'use strict';
const escpos = require('../');
const iconv = require('iconv-lite');

const device = new escpos.USB();

const printer = new escpos.Printer(device);

let data = 'Demo example printiñig pdf417 code';


device.open(function () {

    printer
        .align('rt')
        .pdf417(data)
        .text(data)
        .feed(10)
        .close();
});
