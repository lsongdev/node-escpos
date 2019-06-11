const { Bluetooth, Printer } = require('..');

(async () => {

  try {
    const availablePrinters = await Bluetooth.findPrinters();
    // Uncomment if you want to use a specific printer instead of the first bt device that responds:
    // const preferredPrinterName = 'MHT-P5801';
    // const btPrinter = availablePrinters.filter(p => p && p.name === preferredPrinterName)[0];
    const btPrinter = availablePrinters[0];
    console.log('Connect to ' + btPrinter.name);
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
