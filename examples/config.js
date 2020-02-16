const escpos = require('../');

//Serial printer example
// const device  = new escpos.Serial('/dev/usb/lp0');

//Daruma example here
/*const device  = new escpos.Serial('/dev/cu.usbmodem1D141', {
    baudRate: 9600,
    autoOpen: false,
    rtscts: true,
    dataBits: 8,
    stopBits: 1,
    parity: 'none'
});*/

//USB Printer
//const device  = new escpos.USB();

//Qr Printer Example Here
//const device  = new escpos.USB(0x0485, 0x7541);

//Network Printer
const device  = new escpos.Network('htpc.network');

/*
* Bellow this line you initialize the printer object,
* uncomment one of the lines to test which one fits with you
*/

//ESC/POS generic command-set printers
const printer = new escpos.Printer(device);

//Bematech ESC/BEMA command-set printers
//const printer = new escpos.BematechGeneric(device);

//Daruma printers
//const printer = new escpos.DarumaGeneric(device);

module.exports = {
    device: device,
    printer: printer
}
