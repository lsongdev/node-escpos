const escpos = require('../packages/printer');
escpos.SerialPort = require('../packages/serialport');

const device = new escpos.SerialPort('COM3');
const printer = new escpos.Printer(device);

device.open(function (error) {
    if (error) {
        console.error(error);
        return;
    }
    printer
        .getStatuses(statuses => {
            statuses.forEach(status => {
                console.log(status.toJSON());
            })
        })
        .close();
});
