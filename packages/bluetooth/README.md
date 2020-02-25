
#### Bluetooth(address, channel)
```javascript
const escpos = require('escpos');
escpos.Bluetooth = require('escpos-bluetooth');

const address = '01:23:45:67:89:AB';
const channel = 1;
const bluetoothDevice = new escpos.Bluetooth(address, channel);
```
You can scan for printers using the `escpos.Bluetooth.findPrinters()` method. Check out the examples (bt_promise and bt_find_printer) for more information.
