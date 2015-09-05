var escpos = require('../');

var device  = new escpos.USB(0x0416, 0x5011);
var printer = new escpos.Printer(device);

// printer.control('ht');
// printer.size(1,1);
printer.align('ct');
// printer.style('bu');
printer.println('test');
printer.text('测试');
printer.barcode('12345678', 'EAN8');
printer.cut();
