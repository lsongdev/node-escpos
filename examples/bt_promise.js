const { Bluetooth, Printer } = require('..');

(async () => {

  try {
    const availablePrinters = await Bluetooth.findPrinters();
    const btPrinter = availablePrinters.filter(p => p && p.name === 'MHT-P5801')[0];
    const device = await Bluetooth.getDevice(btPrinter.address, btPrinter.channel);
    const printer = await Printer.create(device);

    await printer.text('hello');
    await printer.cut();
    await printer.close();

    console.log('print job done');
  } catch(error) {
    console.log('error', error);
  }
})();
