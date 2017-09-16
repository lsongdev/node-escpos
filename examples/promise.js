const { USB, Printer } = require('..');

(async () => {

  const device  = await USB.getDevice();
  const printer = await Printer.create(device);

  await printer.text('hello');
  await printer.cut();
  await printer.close();

  console.log('print job done');

})();

