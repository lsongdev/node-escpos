# ESCPOS [![npm version](https://badge.fury.io/js/escpos.svg)](https://www.npmjs.com/package/escpos )

ESC/POS Printer driver for node

[![NPM](https://nodei.co/npm/escpos.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/escpos )

## Installation

````
$ npm i escpos
````

if you use usb as an adapter :

+ On Linux, you'll need `libudev` to build libusb. 
+ On Ubuntu/Debian: `sudo apt-get install build-essential libudev-dev`.
+ On Windows, Use [Zadig](http://sourceforge.net/projects/libwdi/files/zadig/) to install the WinUSB driver for your USB device. 

Otherwise you will get `LIBUSB_ERROR_NOT_SUPPORTED` when attempting to open devices.

## Example

````javascript
const escpos = require('escpos');

const device  = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const printer = new escpos.Printer(device);

device.open(function(){

  printer
  .font('a')
  .align('ct')
  .style('bu')
  .size(1, 1)
  .text('The quick brown fox jumps over the lazy dog')
  .text('敏捷的棕色狐狸跳过懒狗')
  .barcode('12345678', 'EAN8')
  .qrimage('https://github.com/song940/node-escpos', function(err){
    this.cut();
    this.close();
  });

});


````

## Documentation

Escpos inherits its methods to the printers. the following methods are defined:

### text("text")

Prints raw text. Raises TextError exception.

### control("align")

Carrier feed and tabs.

align is a string which takes any of the following values:

+ LF for Line Feed
+ FF for Form Feed
+ CR for Carriage Return
+ HT for Horizontal Tab
+ VT for Vertical Tab


### align("align")

Set text properties.

align set horizontal position for text, the possible values are:

+ CENTER
+ LEFT
+ RIGHT

Default: left

font type could be A or B. Default: A
width is a numeric value, 1 is for regular size, and 2 is twice the standard size. Default: 1
height is a numeric value, 1 is for regular size and 2 is twice the standard size. Default: 1

### barcode("code", "barcode_type", width, height, "position", "font")

Prints a barcode.

code is an alphanumeric code to be printed as bar code
barcode_type must be one of the following type of codes:

+ UPC-A
+ UPC-E
+ EAN13
+ EAN8
+ CODE39
+ ITF
+ NW7

width is a numeric value in the range between (1,255) Default: 64
height is a numeric value in the range between (2,6) Default: 3
position is where to place the code around the bars, could be one of the following values:

+ ABOVE
+ BELOW
+ BOTH
+ OFF

Default: BELOW

font is one of the 2 type of fonts, values could be:

+ A
+ B

Default: A

Raises BarcodeTypeError, BarcodeSizeError, BarcodeCodeError exceptions.

### cut("mode")

Cut paper.

mode set a full or partial cut. Default: full
Partial cut is not implemented in all printers.

### cashdraw(pin)

Sends a pulse to the cash drawer in the specified pin.

pin is a numeric value which defines the pin to be used to send the pulse, it could be 2 or 5.
Raises CashDrawerError()

## Thanks

+ Part of code from [@taoyuan](https://github.com/taoyuan)

## Contributing
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

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
