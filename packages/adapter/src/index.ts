'use strict';
const EventEmitter = require('events');

export class NotImplementedException extends Error {}

export abstract class Adapter extends EventEmitter {
  abstract open(): Adapter;
  abstract write(data: Buffer, callback: (error?: Error) => void): Adapter;
  abstract close(callback?: (error?: Error) => void): Adapter;
  abstract read(callback?: (data: Buffer) => void): void;
}
