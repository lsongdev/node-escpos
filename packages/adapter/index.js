'use strict';
const EventEmitter = require('events');

class NotImplementedException extends Error {
  // Nothing.
}

class Adapter extends EventEmitter {
  open() {
    throw new NotImplementedException();
  }
  write() {
    throw new NotImplementedException();
  }
  close() {
    throw new NotImplementedException();
  }
  read() {
    throw new NotImplementedException();
  }
}
module.exports = Adapter;
