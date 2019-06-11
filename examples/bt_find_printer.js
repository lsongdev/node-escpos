const { Bluetooth } = require('..');

(async () => {

  const printers = await Bluetooth.findPrinters();
  console.log(printers);

})();
