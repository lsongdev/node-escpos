## ESCPOS PROJECT

ESC/POS Printer driver for Node.js

[![npm version](https://badge.fury.io/js/escpos.svg)](https://www.npmjs.com/package/escpos )
[![Build Status](https://travis-ci.org/song940/node-escpos.svg?branch=master)](https://travis-ci.org/song940/node-escpos)

[![NPM](https://nodei.co/npm/escpos.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/escpos )

Packages Available:

+ [escpos Printer](packages/printer/README.md)
+ [escpos Screen Display](packages/screen/README.md)
+ [escpos USB Adapter](packages/usb/README.md)
+ [escpos Network Adapter](packages/network/README.md)
+ [escpos Bluetooth Adapter](packages/bluetooth/README.md)
+ [escpos SerialPort Adapter](packages/serialport/README.md)

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
Copyright (c) 2015 ~ now Lsong <hi@lsong.org>

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

