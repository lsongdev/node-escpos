'use strict';
import usb, {OutEndpoint} from 'usb';
import os from "os";
import {Adapter, NotImplementedException} from "escpos-adapter";

/**
 * [USB Class Codes ]
 * @type {Object}
 * @docs http://www.usb.org/developers/defined_class
 */
const IFACE_CLASS = {
  AUDIO  : 0x01,
  HID    : 0x03,
  PRINTER: 0x07,
  HUB    : 0x09
};

export default class USB extends Adapter<[]> {
  private device: usb.Device | null = null;
  private endpoint: usb.OutEndpoint | null = null;

  constructor();
  constructor(vid: number, pid: number);
  constructor(device: usb.Device);
  constructor(vidOrDevice?: number | usb.Device, pid?: number) {
    super();
    if(vidOrDevice !== undefined && pid !== undefined){
      this.device = usb.findByIds(vidOrDevice as number, pid);
    } else if(vidOrDevice !== undefined){
      // Set spesific USB device from devices array as coming from USB.findPrinter() function.
      // for example
      // let devices = escpos.USB.findPrinter();
      // => devices [ Device1, Device2 ];
      // And Then
      // const device = new escpos.USB(Device1); OR device = new escpos.USB(Device2);
      this.device = vidOrDevice as usb.Device;
    } else {
      const devices = USB.findPrinter();
      if (devices.length > 0) [this.device] = devices;
    }
    if (!this.device) throw new Error('Can not find printer');

    usb.on('detach', device => {
      if(device == this.device) {
        this.emit('detach'    , device);
        this.emit('disconnect', device);
        this.device = null;
      }
    });
  }

  /**
   * [findPrinter description]
   * @return {[type]} [description]
   */
  static findPrinter() {
    return usb.getDeviceList().filter(device => {
      try {
        return device.configDescriptor.interfaces
          .filter(iface => iface.filter(conf => conf.bInterfaceClass === IFACE_CLASS.PRINTER).length > 0)
          .length > 0;
      } catch(e) {
        // console.warn(e)
        return false;
      }
    });
  };

  /**
   * getDevice
   */
  static getDevice(vid: number, pid: number) {
    return new Promise((resolve, reject) => {
      const device = new USB(vid, pid);
      device.open(err => {
        if(err) return reject(err);
        resolve(device);
      });
    });
  };

  /**
   * [open usb device]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  open(callback?: (error: Error | null) => void) {
    let counter = 0;
    const device = this.device;
    if (device === null) throw new Error('The device has been detached');
    device.open();
    device.interfaces.forEach(iface => {
      iface.setAltSetting(iface.altSetting, () => {
        try {
          // http://libusb.sourceforge.net/api-1.0/group__dev.html#gab14d11ed6eac7519bb94795659d2c971
          // libusb_kernel_driver_active / libusb_attach_kernel_driver / libusb_detach_kernel_driver : "This functionality is not available on Windows."
          if ("win32" !== os.platform()) {
            if (iface.isKernelDriverActive()) {
              try {
                iface.detachKernelDriver();
              } catch(e) {
                console.error("[ERROR] Could not detatch kernel driver: %s", e)
              }
            }
          }
          iface.claim(); // must be called before using any endpoints of this interface.
          iface.endpoints.filter(endpoint => {
            if (endpoint.direction == 'out' && !this.endpoint) {
              this.endpoint = endpoint as OutEndpoint;
            }
          });
          if (this.endpoint) {
            this.emit('connect', this.device);
            callback && callback(null);
          } else if (++counter === device.interfaces.length && !this.endpoint){
            callback && callback(new Error('Can not find endpoint from printer'));
          }
        } catch (e) {
          // Try/Catch block to prevent process from exit due to uncaught exception.
          // i.e LIBUSB_ERROR_ACCESS might be thrown by claim() if USB device is taken by another process
          // example: MacOS Parallels
          callback && callback(e);
        }
      });
    });
    return this;
  };

  write(data: Buffer, callback?: (error: Error | null) => void) {
    this.emit('data', data);
    if (this.endpoint === null) throw new Error('Device not connected');
    this.endpoint.transfer(data, (error) => {
      callback && callback(error ?? null);
    });
    return this;
  };

  close(callback?: (error: Error | null) => void) {
    if (this.device) {
      try {
        this.device.close();
        // TODO: Update definitions when ready: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/57557
        usb.removeAllListeners('detach');

        callback && callback(null);
        this.emit('close', this.device);
      } catch (e) {
        callback && callback(e);
      }
    }
    else {
      callback && callback(null);
    }

    return this;
  }

  read() {
    throw new NotImplementedException();
  }
}
