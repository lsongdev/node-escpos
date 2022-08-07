'use strict';
import net from "net";
import {Adapter} from "escpos-adapter";

/**
 * Network Adapter
 */
export default class Network extends Adapter<[device: net.Socket]> {
  private readonly address: string;
  private readonly port: number;
  private readonly timeout: number;
  private readonly device: net.Socket;

  /**
   * @param {[type]} address
   * @param {[type]} port
   */
  constructor(address: string, port = 9100, timeout = 30000) {
    super();
    this.address = address;
    this.port = port;
    this.timeout = timeout;
    this.device = new net.Socket();
  }

  /**
   * connect to remote device
   * @praram {[type]} callback
   * @return
   */
  open(callback?: (error: Error | null, device: net.Socket) => void) {
     // start timeout on open
     const connection_timeout = setTimeout(() => {
      this.device.destroy();
      callback && callback(
        new Error(`printer connection timeout after ${this.timeout}ms`), this.device
      );
    }, this.timeout);

    // connect to net printer by socket (port, ip)
    this.device.on("error", (err) => {
      callback && callback(err, this.device);
    }).on('data', buf => {
      // console.log('printer say:', buf);
    }).connect(this.port, this.address, (err?: Error | null) => {
      clearInterval(connection_timeout);
      this.emit('connect', this.device);
      callback && callback(err ?? null, this.device);
    });
    return this;
  };

  /**
   * write data to printer
   * @param {[type]} data -- byte data
   * @param {Function} callback
   * @return
   */
  write(data: string | Buffer, callback?: (error: Error | null) => void) {
    const handler: Function = (error?: Error | null) => {
      if (callback) callback(error ?? null);
    };
    if (typeof data === 'string') this.device.write(data, handler);
    else this.device.write(data, handler);
    return this;
  };

  read(callback?: (data: Buffer) => void) {
    this.device.on('data', buf => {
      if (callback) callback(buf);
    })
    return this;
  }

  /**
   * [close description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  close(callback?: (error: Error | null, device: net.Socket) => void) {
    this.device.destroy();
    this.emit('disconnect', this.device);
    callback && callback(null, this.device);
    return this;
  }
}
