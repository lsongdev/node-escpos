const escpos = require('..');
const assert = require('assert');

describe('ESC/POS printing test', function() {

  it('device#write', function(done){
    var device = new escpos.Console(function(data){
      assert.equal(data.length, 3);
      done();
    });
    device.write(new Buffer(3));
  })

  it('printer#print', function(done){
    var device = new escpos.Console(function(data){
      assert.deepEqual(data, new Buffer('hello world'));
      done();
    });
    var printer = new escpos.Printer(device);
    printer.print('hello world').flush();
  })

  it('printer#print2', function(done){
       
 const networkDevice = new escpos.Network('192.168.1.87', 9100);


 const options = { encoding: "windows1254" /* default */ }
 // encoding is optional
 
 const printer = new escpos.Printer(networkDevice, options);
 
 
 
 networkDevice.open(function(){
  printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols,)
    { text:"Left", align:"LEFT", width:0.33 },
    { text:"Large Message for New Line  ", align:"LEFT", width:0.33  },
    { text:"Right", align:"RIGHT", width:0.33 }
  ]);
  printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols)
    { text:"Left", align:"LEFT", width:0.13 },
    { text:"Left", align:"LEFT", width:0.10 },
    { text:"Center", align:"CENTER", width:0.33 },
    { text:"Right", align:"RIGHT", width:0.33 }
  ]);
  printer.drawLine();
  printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols)
    { text:"Left", align:"LEFT", width:0.33 },
    { text:"Center", align:"CENTER", width:0.33},
    { text:"Right", align:"RIGHT", width:0.33 }
  ]);
  printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols)
    { text:"Left", align:"LEFT", width:0.33 },
    { text:"Center", align:"CENTER", width:0.33 },
    { text:"Right", align:"RIGHT", width:0.33 }
  ]);
  printer.newLine();
  printer.newLine();
  printer.newLine();
  printer.newLine();
   printer.cut();
   printer.close();
   printer.beep();

   done();
 });
  })

});