const tcp = require('net');

class Server extends tcp.Server {
  constructor(device){
    super();
    this.device = device;
    this.on('connection', this.request);
  }
  request(client){
    client.pipe(this.device);
  }
}

module.exports = Server;
