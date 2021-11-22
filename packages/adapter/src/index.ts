'use strict';
const EventEmitter = require('events');

export class NotImplementedException extends Error {}

export type WriteCallback = (error?: Error) => void;

export abstract class Adapter<CloseArgs extends []> extends EventEmitter {
  abstract open(): this;
  abstract write(data: Buffer | string, callback?: WriteCallback): this;
  abstract close(callback?: (error?: Error) => void, ...closeArgs: CloseArgs): this;
  abstract read(callback?: (data: Buffer) => void): void;
}
