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
// install escpos-usb adapter module manually
escpos.USB = require('escpos-usb');
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
  .tableCustom(
    [
      { text:"Left", align:"LEFT", width:0.33, style: 'B' },
      { text:"Center", align:"CENTER", width:0.33},
      { text:"Right", align:"RIGHT", width:0.33 }
    ],
    { encoding: 'cp857', size: [1, 1] } // Optional
  )
  .qrimage('https://github.com/song940/node-escpos', function(err){
    this.cut();
    this.close();
  });
});
````
- See `./examples` for more examples.

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
