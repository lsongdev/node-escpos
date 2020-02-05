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
});
