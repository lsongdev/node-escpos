
#### Serial("port", options)
```javascript
const escpos = require('escpos');
escpos.SerialPort = require('escpos-serialport');

const serialDeviceOnWindows = new escpos.SerialPort('COM10');
const serialDeviceOnLinux = new escpos.SerialPort('/dev/usb/lp0', {
  baudRate: 14400,
  stopBit: 2
});
```
Check the [serialport package documentation](https://github.com/EmergingTechnologyAdvisors/node-serialport#serialportopenoptions--object) for more options.
