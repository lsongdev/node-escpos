const escpos = require('../packages/printer');
escpos.SerialPort = require('../packages/serialport');
const statuses = require('../packages/printer/src/statuses');

const device = new escpos.SerialPort('COM3');
const printer = new escpos.Printer(device);

device.open(function (error) {
    if (error) {
        console.error(error);
        return;
    }

    printer
        .getStatus('PrinterStatus', status => {
            console.log(status.toJSON());
        })
        .close();
});
