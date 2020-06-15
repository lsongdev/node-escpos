const _ = require('./commands')

class NotImplementedException extends Error {
}

class DeviceStatus {
  byte = '';
  bits = [];
  bitsAsc = [];

  constructor(byte) {
    this.byte = byte;
    for (let j = 7; j >= 0; j--) {
      let bit = byte & (1 << j) ? 1 : 0;
      this.bits.push(bit);
    }

    this.bitsAsc = this.bits.slice();
    this.bitsAsc.reverse();
  }

  getBits() {
    return this.bits.join('');
  }

  static commands() {
    throw new NotImplementedException();
  }

  static getClassName() {
    throw new NotImplementedException();
  }

  toJSON() {
    return {
      className: this.constructor.getClassName(),
      byte: this.byte,
      bits: this.getBits(),
      statuses: []
    };
  }
}

class PrinterStatus extends DeviceStatus {
  static commands() {
    return [_.DLE, _.EOT, String.fromCharCode(1)];
  }

  static getClassName() {
    return 'PrinterStatus';
  }

  toJSON() {
    let result = super.toJSON();
    for (let i = 0; i < 8; i++) {
      let label = '';
      let status = 'ok';
      switch (i) {
        case 2:
          if (this.bitsAsc[i] === 1) {
            label = 'Drawer kick-out connector pin 3 is HIGH';
          } else {
            label = 'Drawer kick-out connector pin 3 is LOW';
          }
          break;
        case 3:
          if (this.bitsAsc[i] === 1) {
            status = 'error'
            label = 'Offline';
          } else {
            label = 'Online';
          }
          break;
        case 5:
          if (this.bitsAsc[i] === 1) {
            status = 'error';
            label = 'Waiting for online recovery';
          } else {
            label = 'Not waiting for online recovery';
          }
          break;
        case 6:
          if (this.bitsAsc[i] === 1) {
            label = 'Paper feed button is being pressed';
          } else {
            label = 'Paper feed button is not being pressed';
          }
          break;
        default:
          label = 'Fixed';
          break;
      }

      result.statuses.push({
        bit: i,
        value: this.bitsAsc[i],
        label: label,
        status: status
      });
    }

    return result;
  }
}

class OfflineCauseStatus extends DeviceStatus {
  static commands() {
    return [_.DLE, _.EOT, String.fromCharCode(2)];
  }

  static getClassName() {
    return 'OfflineCauseStatus';
  }

  toJSON() {
    let result = super.toJSON();
    for (let i = 0; i < 8; i++) {
      let label = '';
      let status = 'ok';
      switch (i) {
        case 2:
          if (this.bitsAsc[i] === 1) {
            status = 'error';
            label = 'Cover is open';
          } else {
            label = 'Cover is closed';
          }
          break;
        case 3:
          if (this.bitsAsc[i] === 1) {
            status = 'error';
            label = 'Paper is being fed by the paper feed button';
          } else {
            label = 'Paper is not being fed by the paper feed button';
          }
          break;
        case 5:
          if (this.bitsAsc[i] === 1) {
            status = 'error';
            label = 'Printing stops due to a paper-end';
          } else {
            label = 'No paper-end stop';
          }
          break;
        case 6:
          if (this.bitsAsc[i] === 1) {
            status = 'error';
            label = 'Error occurred';
          } else {
            label = 'No error';
          }
          break;
        default:
          label = 'Fixed';
          break;
      }

      result.statuses.push({
        bit: i,
        value: this.bitsAsc[i],
        label: label,
        status: status
      });
    }

    return result;
  }
}

class ErrorCauseStatus extends DeviceStatus {
  static commands() {
    return [_.DLE, _.EOT, String.fromCharCode(3)];
  }

  static getClassName() {
    return 'ErrorCauseStatus';
  }

  toJSON() {
    let result = super.toJSON();
    for (let i = 0; i < 8; i++) {
      let label = '';
      let status = 'ok';
      switch (i) {
        case 2:
          if (this.bitsAsc[i] === 1) {
            status = 'error';
            label = 'Recoverable error occurred';
          } else {
            label = 'No recoverable error';
          }
          break;
        case 3:
          if (this.bitsAsc[i] === 1) {
            status = 'error';
            label = 'Autocutter error occurred';
          } else {
            label = 'No autocutter error';
          }
          break;
        case 5:
          if (this.bitsAsc[i] === 1) {
            status = 'error';
            label = 'Unrecoverable error occurred';
          } else {
            label = 'No unrecoverable error';
          }
          break;
        case 6:
          if (this.bitsAsc[i] === 1) {
            status = 'error';
            label = 'Auto-recoverable error occurred';
          } else {
            label = 'No auto-recoverable error';
          }
          break;
        default:
          label = 'Fixed';
          break;
      }

      result.statuses.push({
        bit: i,
        value: this.bitsAsc[i],
        label: label,
        status: status
      });
    }

    return result;
  }
}

class RollPaperSensorStatus extends DeviceStatus {
  static commands() {
    return [_.DLE, _.EOT, String.fromCharCode(4)];
  }

  static getClassName() {
    return 'RollPaperSensorStatus';
  }

  toJSON() {
    let result = super.toJSON();

    for (let i = 0; i <= 1; i++) {
      result.statuses.push({
        bit: i,
        value: this.bitsAsc[i],
        label: 'Fixed',
        status: 'ok'
      });
    }

    let label = '';
    let status = 'ok';
    if (this.bitsAsc[2] === 1 && this.bitsAsc[3] === 1) {
      status = 'warning';
      label = 'Roll paper near-end sensor: paper near-end';
    } else if (this.bitsAsc[2] === 0 && this.bitsAsc[3] === 0) {
      label = 'Roll paper near-end sensor: paper adequate';
    }

    result.statuses.push({
      bit: '2,3',
      value: "" + this.bitsAsc[2] + this.bitsAsc[3],
      label: label,
      status: status
    });

    result.statuses.push({
      bit: 4,
      value: this.bitsAsc[4],
      label: 'Fixed',
      status: 'ok'
    });

    label = '';
    status = 'ok';
    if (this.bitsAsc[5] === 1 && this.bitsAsc[6] === 1) {
      status = 'error';
      label = 'Roll paper end sensor: paper not present';
    } else if (this.bitsAsc[5] === 0 && this.bitsAsc[6] === 0) {
      label = 'Roll paper end sensor: paper present';
    }

    result.statuses.push({
      bit: '5,6',
      value: "" + this.bitsAsc[5] + this.bitsAsc[6],
      label: label,
      status: status
    });

    for (let i = 7; i <= 8; i++) {
      result.statuses.push({
        bit: i,
        value: this.bitsAsc[i],
        label: 'Fixed',
        status: 'ok'
      });
    }

    return result;
  }
}

module.exports = {
  PrinterStatus: PrinterStatus,
  OfflineCauseStatus: OfflineCauseStatus,
  ErrorCauseStatus: ErrorCauseStatus,
  RollPaperSensorStatus: RollPaperSensorStatus,
};
