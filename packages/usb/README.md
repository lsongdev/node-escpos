
#### USB(vid, pid)
```javascript
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const usbDevice = new escpos.USB(0x01, 0xff);
```
vid(Vendor Id) and pid (Product Id) can be checked with the `lsusb` command or `escpos.USB.findPrinter()` method.
