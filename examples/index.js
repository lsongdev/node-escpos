var escpos = require('../');

var device  = new escpos.USB(0x0416, 0x5011);
var printer = new escpos.Printer(device);

// printer.font('C');
printer.align('ct');
// printer.style('bu');
// printer.size(1,1);
//
// printer.print()
// console.log(new Buffer([ 27, 97, 2 ]));
// printer.text('The quick brown fox jumps over the lazy dog');
// printer.barcode('12345678', 'EAN8');
//
printer.cut();
