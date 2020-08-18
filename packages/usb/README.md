## escpos-usb

If you use usb as an adapter :

+ On Linux, you'll need `libudev` to build libusb.
+ On Ubuntu/Debian: `sudo apt-get install build-essential libudev-dev`.
+ On Windows, Use [Zadig](http://sourceforge.net/projects/libwdi/files/zadig/) to install the WinUSB driver for your USB device.

Otherwise you will get `LIBUSB_ERROR_NOT_SUPPORTED` when attempting to open devices.


#### USB(vid, pid)
```javascript
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const usbDevice = new escpos.USB(0x01, 0xff);
```
vid(Vendor Id) and pid (Product Id) can be checked with the `lsusb` command or `escpos.USB.findPrinter()` method.
