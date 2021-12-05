'use strict';
const EventEmitter = require('events');

export class NotImplementedException extends Error {}

export abstract class Adapter<CloseArgs extends []> extends EventEmitter {
  abstract open(callback?: (error: Error | null) => void): this;
  abstract write(data: Buffer | string, callback?: (error: Error | null) => void): this;
  abstract close(callback?: (error: Error | null) => void, ...closeArgs: CloseArgs): this;
  abstract read(callback?: (data: Buffer) => void): void;
}
