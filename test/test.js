const escpos = require('..');
const assert = require('assert');

describe('ESC/POS printing test', function() {

  it('device#write', function(done){
    var device = new escpos.Console(function(data){
      assert.equal(data.length, 3);
      done();
    });
    device.write(Buffer.alloc(3));
  })

  it('printer#print', function(done){
    var device = new escpos.Console(function(data){
      assert.deepEqual(data, Buffer.from('hello world'));
      done();
    });
    var printer = new escpos.Printer(device);
    printer.print('hello world').flush();
  })

  it('printer#tableCustom', function (done){
    var output = null
    var device = new escpos.Console(function(data) {
      assert.deepEqual(data, Buffer.from("hello world"));
      done();
    });

    var printer = new escpos.Printer(device)
    output = printer
      .font('A')
      .encode('utf8')
      .tableCustom([
        { text: "Check:13", align: "LEFT" },
        { text: "Table:A1", align: "RIGHT" }
      ], { size: [2, 1] })
      .newLine()
      .align("CT")
      .size(1, 1)
      .text("Misafir")
      .size(2, 1)
      .text("Check")
      .resetStyle()
      .drawLine()
      .cut()
      .close()
  })
});
