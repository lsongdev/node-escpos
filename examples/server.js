const escpos = require('..');

const device = new escpos.USB();
const server = new escpos.Server(device);

device.open(() => {
  server.listen(6000, err => {
    console.log('Your printer is running at', server.address().port);
  });
});
