'use strict';
import { Adapter } from "escpos-adapter/src";
import { SerialPort } from 'serialport';

/**
 * SerialPort device
 * @param {[type]} port
 * @param {[type]} options
 */
export default class Serial extends Adapter<[timeout?: number]> {
  private device: SerialPort | null;
  constructor(port: string, options: any) {
    super();
    this.device = new SerialPort({ path: port, ...options });
    this.device.on('close', () => {
      this.emit('disconnect', this.device);
      this.device = null;
    });
  }

  /**
   * List Printers
   * @returns {[Array]}
   */
  async list() {
    const ports = await SerialPort.list();
    return ports;
  }

  /**
   * open deivce
   * @param  {Function} callback
   * @return {[type]}
   */
  open(callback?: (error: Error | null) => void) {
    if (this.device === null) throw new Error('Serial port device disconnected');
    this.device.open((error: any) => {
      if (callback) callback(error ?? null);
    });
    return this;
  };

  /**
   * write data to serialport device
   * @param  {[type]}   data      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  write(data: Buffer | string, callback?: (error: Error | null) => void) {
    if (this.device === null) throw new Error('Serial port device disconnected');
    this.device.write(data, (error) => {
      if (callback) callback(error ?? null);
    });
    return this;
  };

  /**
   * close device
   * @param  {Function} callback  [description]
   * @param  {int}      timeout   [allow manual timeout for emulated COM ports (bluetooth, ...)]
   * @return {[type]} [description]
   */
  close(callback?: (error: Error | null, device: SerialPort) => void, timeout = 0) {
    const device = this.device;
    if (device === null) return this;

    device.drain(() => {
      device.flush((err) => {
        setTimeout(() => {
          err ? callback && callback(err, device) : device.close((err) => {
            this.device = null;
            if (callback) callback(err ?? null, device);
          });

        }, Math.max(timeout, 0));
      });
    });
    return this;

  };

  /**
   * read buffer from the printer
   * @param  {Function} callback
   * @return {Serial}
   */
  read(callback?: (data: Buffer) => void) {
    if (this.device === null) throw new Error('Serial port device disconnected');
    this.device.on('data', function (data) {
      if (callback) callback(data);
    });
    return this;
  };
}
