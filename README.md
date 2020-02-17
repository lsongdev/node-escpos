# ESCPOS

ESC/POS Printer driver for node

[![NPM](https://nodei.co/npm/escpos.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/escpos )

[![npm version](https://badge.fury.io/js/escpos.svg)](https://www.npmjs.com/package/escpos )
[![Build Status](https://travis-ci.org/song940/node-escpos.svg?branch=master)](https://travis-ci.org/song940/node-escpos)

## Installation

### npm
```bash
$ npm i escpos --save
```

### yarn
```bash
$ yarn add escpos
```

if you use usb as an adapter :

+ On Linux, you'll need `libudev` to build libusb.
+ On Ubuntu/Debian: `sudo apt-get install build-essential libudev-dev`.
+ On Windows, Use [Zadig](http://sourceforge.net/projects/libwdi/files/zadig/) to install the WinUSB driver for your USB device.

Otherwise you will get `LIBUSB_ERROR_NOT_SUPPORTED` when attempting to open devices.

## Example

````javascript
const escpos = require('escpos');

// Select the adapter based on your printer type
const device  = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const options = { encoding: "GB18030" /* default */ }
// encoding is optional

const printer = new escpos.Printer(device, options);



device.open(function(error){
  printer
  .font('a')
  .align('ct')
  .style('bu')
  .size(1, 1)
  .text('The quick brown fox jumps over the lazy dog')
  .text('敏捷的棕色狐狸跳过懒狗')
  .barcode('1234567', 'EAN8')
  .table(["One", "Two", "Three"])
  .tableCustom([
    { text:"Left", align:"LEFT", width:0.33 },
    { text:"Center", align:"CENTER", width:0.33},
    { text:"Right", align:"RIGHT", width:0.33 }
  ])
  .qrimage('https://github.com/song940/node-escpos', function(err){
    this.cut();
    this.close();
  });
});
````
- See `./examples` for more examples.

----
## Adapter

### Constructors

You can choose your adapter type as USB, Serial, Bluetooth, Network, or Console.

#### USB(vid, pid)
```javascript
const usbDevice = new escpos.USB(0x01, 0xff);
```
vid(Vendor Id) and pid (Product Id) can be checked with the `lsusb` command or `escpos.USB.findPrinter()` method.

#### Serial("port", options)
```javascript
const serialDeviceOnWindows = new escpos.Serial('COM10');
const serialDeviceOnLinux = new escpos.Serial('/dev/usb/lp0', {
  baudRate: 14400,
  stopBit: 2
});
```
Check the [serialport package documentation](https://github.com/EmergingTechnologyAdvisors/node-serialport#serialportopenoptions--object) for more options.

#### Bluetooth(address, channel)
```javascript
const address = '01:23:45:67:89:AB';
const channel = 1;
const bluetoothDevice = new escpos.Bluetooth(address, channel);
```
You can scan for printers using the `escpos.Bluetooth.findPrinters()` method. Check out the examples (bt_promise and bt_find_printer) for more information.

#### Network(address, port = 9100)
```javascript
const networkDevice = new escpos.Network('localhost', 3000);
```
The default port number is 9100.

#### Console(handler = stdout)
```javascript
const debugDevice = new escpos.Console();
```

### Methods

#### open(function callback[err])

Claims the current device USB (or other device type), if the printer is already in use by other process this will fail and return the error parameter.

By default, the USB adapter will set the first printer found .

Triggers the callback function when done.

#### close(function callback)

Closes the current device and releases its USB interface.

----

## Printer

### Constructors

#### Printer(device)

```javascript
const usbDevice = new escpos.USB();
const usbPrinter = new escpos.Printer(usbDevice);

const serialDevice = new escpos.Serial('/dev/usb/lp0');
const serialPrinter = new escpos.Printer(serialDevice);

const bluetoothDevice = new escpos.Bluetooth('01:23:45:67:89:AB', 1);
const bluetoothPrinter = new escpos.Printer(bluetoothDevice);

const networkDevice = new escpos.Network('localhost');
const networkPrinter = new escpos.Printer(networkDevice);
```

### Methods

Escpos inherits its methods to the printers. the following methods are defined:

#### text("text", encodeType)

Prints raw text. Raises TextError exception.

For the encode type, see the [iconv-lite wiki document](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings). Escpos uses `iconv-lite` for encoding.

If the type is undefined, the default type is GB18030.

#### async image(imagePath, "density")

Prints an image at a set density.

Density consists of a character signaling the base density setting, `s` for single, `d` for double, followed by an integer for image sampling - `8` (8-bit) or `24`.

```javascript
printer.align('ct')
       .image(image, 's8')
       .then(() => { 
          printer.cut()
                 .close(); 
       });
```

#### encode("encodeType")

Sets the encoding value globally. default type is GB18030 (Chinese)

```javascript
printer
.encode('EUC-KR')
.text('동해물과 백두산이 마르고 닳도록');
```

#### control("align")

Carrier feed and tabs.

align is a string which takes any of the following values:

+ LF for Line Feed
+ FF for Form Feed
+ CR for Carriage Return
+ HT for Horizontal Tab
+ VT for Vertical Tab


#### align("align")

Set text properties.

align set horizontal position for text, the possible values are:

+ CT is the Center alignment
+ LT is the Left alignment
+ RT is the Right alignment

Default: LT

#### font("type")
font type could be A or B. Default: A

#### size(width, heigth)

width is a numeric value, 1 is for regular size, and 2 is twice the standard size. Default: 1

height is a numeric value, 1 is for regular size and 2 is twice the standard size. Default: 1



#### barcode("code", "barcodeType", "options")

Prints a barcode.

"code" is an alphanumeric code to be printed as bar code
"barcodeType" must be one of the following type of codes:

+ UPC-A
+ UPC-E
+ EAN13
+ EAN8
+ CODE39
+ ITF
+ NW7

The EAN type automatically calculates the last parity bit. For the EAN13 type, the length of the string is limited to 12, and EAN8 is limited to 7. (#57)
If you wish to disable the parity bit you must set `"includeParity": false` in the options provided to the command.

**"options"**

- "options.width" (default=1) is a numeric value ranging between 1 up to 5. 
- "options.height" (default=100) is a numeric value ranging between 1 up to 255.
- "options.includeParity" (default=true) When true parity bit is calculated for EAN13/EAN8 bar code
- "options.position" (default=BLW) where to place the barcode numeric value: OFF|ABV|BLW|BTH

  + ABV = ABOVE
  + BLW = BELOW
  + BTH = BOTH
  + OFF = OFF

- "options.font" (default=A) the font size: A|B


Raises BarcodeTypeError, BarcodeSizeError, BarcodeCodeError exceptions.

For backward compatibility the old method interface is still supported:


  barcode("code", "barcodeType", width, height, "position", "font")





#### cut("mode")

Cut paper.

mode set a full or partial cut. Default: full
Partial cut is not implemented in all printers.

*** Don't foget this, because cut will flush buffer to printer ***

#### cashdraw(pin)

Sends a pulse to the cash drawer in the specified pin.

pin is a numeric value which defines the pin to be used to send the pulse, it could be 2 or 5.
Raises `CashDrawerError()``

#### beep(n,t)

Printer Buzzer (Beep sound).

"n" Refers to the number of buzzer times.
"t" Refers to the buzzer sound length in (t * 100) milliseconds.

----

## Screen

### Constructors

#### Screen(device)

```javascript
const usbDevice = new escpos.USB();
const usbScreen = new escpos.Screen(usbDevice);

const serialDevice = new escpos.Serial('/dev/ttyUSB0');
const serialScreen = new escpos.Screen(serialDevice);

const bluetoothDevice = new escpos.Bluetooth('01:23:45:67:89:AB', 1);
const bluetoothScreen = new escpos.Screen(bluetoothDevice);

const networkDevice = new escpos.Network('localhost');
const networkScreen = new escpos.Screen(networkDevice);
```

### Methods

#### clear()

Clears all displayed characters.

#### clearLine()

Clears the line containing the cursor.

#### moveUp()

Moves the cursor up one line.

#### moveLeft()

Moves the cursor one character position to the left.

#### moveRight()

Moves the cursor one character position to the right.

#### moveDown()

Moves the cursor down one line.

#### moveHome()

Moves the cursor to the left-most position on the upper line (home position).

#### moveMaxRight()

Moves the cursor to the right-most position on the current line.

#### moveMaxLeft()

Moves the cursor to the left-most position on the current line.

#### moveBottom()

Moves the cursor to the bottom position.

#### move(n, m)

Moves the cursor to the nth position on the mth line.

#### overwrite()

Selects overwrite mode as the screen display mode.

#### verticalScroll()

Selects vertical scroll mode as the screen display mode.

#### horizontalScroll()

Selects horizontal scroll mode as the display screen mode.

#### cursor(display)

Turn cursor display mode on/off.

"display" Refers to the on/off boolean state.

#### blink(step)

Sets display screen blank interval.
"step" Refers to the blink interval. The interval [ON= step × 50 ms] / [OFF = step × 50 ms] is repeated.

#### timer(h, m)

Sets the counter time and displays it in the bottom right of the screen.
"h" Refers to hours: 0≤ h ≤ 23
"m" Refers to minutes: 0≤ m ≤ 59

#### displayTimer()

Displays the time counter at the right side of the bottom line.

#### brightness(level)

Sets the brightness of the fluorescent character display tube.
"level" Refers to brightness level: 1 ≤ level ≤ 4

#### reverse(n)

Selects or cancels reverse display of the characters received after this command.
"n" Refers selects/cancels reverse boolean state.

#### text("text", encodeType)

Prints raw text. Raises TextError exception.

For the encode type, see the [iconv-lite wiki document](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings). Escpos uses `iconv-lite` for encoding.

If the type is undefined, the default type is GB18030.

#### encode("encodeType")

Sets the encoding value globally. default type is GB18030 (Chinese)

#### close(function callback)

Flush buffer and closes the current device.

----

## Screencast

![img_1031](https://user-images.githubusercontent.com/8033320/29250339-d66ce470-807b-11e7-89ce-9962da88ca18.JPG)

----

## Contributing
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

----

## Contributors

Thanks to our [contributors][contributors-href] 🎉👏

+ [Tao Yuan](https://github.com/taoyuan)
+ [Jose Vera](https://github.com/jor3l)
+ [Sébastien Vidal](https://github.com/Psychopoulet)
+ [Yu Yongwoo](https://github.com/uyu423)
+ [Attawit Kittikrairit](https://github.com/atton16)
+ [Michael Kuenzli](https://github.com/pfirpfel)

[![](https://opencollective.com/node-escpos/contributors.svg?width=890&button=false)][contributors-href]

----

### MIT license
Copyright (c) 2015 lsong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---

[contributors-href]: https://github.com/song940/node-escpos/graphs/contributors
