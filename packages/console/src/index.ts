'use strict';
import {Adapter, NotImplementedException} from "escpos-adapter";

/**
 * [stdout description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function stdout(data: string | Buffer) {
  const bit = 8;
  for (let i=0; i < data.length; i += bit){
    let arr = [];
    for (let j = 0; j < bit && i + j < data.length; j++) arr.push(data[i + j]);
    arr = arr
      .map((b) => b.toString(16).toUpperCase())
      .map((b) => {
        if (b.length == 1) b = '0' + b;
        return b;
      })
    console.log(arr.join(' '));
  }
  console.log();
}

/**
 * [Console description]
 */
export default class Console extends Adapter<[]> {
  public handler: (data: (string | Buffer)) => void;

  constructor(handler: (data: string | Buffer) => void = stdout) {
    super();
    this.handler = handler;
  }

  /**
   * [open description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  open(callback?: (error: Error | null) => void) {
    if (callback) callback(null);
    return this;
  };

  /**
   * [write description]
   * @param  {[type]} data [description]
   * @param  {Function} callback  [description]
   * @return {[type]}      [description]
   */
  write(data: string | Buffer, callback?: (error: Error | null) => void) {
    this.handler(data);
    if (callback) callback(null);
    return this;
  };

  close(callback?: (error: Error | null) => void) {
    if (callback) callback(null);
    return this;
  }

  read() {
    return NotImplementedException;
  }
}
