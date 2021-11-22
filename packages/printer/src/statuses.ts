const _ = require('./commands')

enum Status {
  Ok = 'ok',
  Warning = 'warning',
  Error = 'error',
}

interface StatusJSONElementSingle {
  bit: number;
  value: 0 | 1;
  label: string;
  status: Status;
}

interface StatusJSONElementMultiple {
  bit: string;
  value: string;
  label: string;
  status: Status;
}

type StatusJSONElement = StatusJSONElementSingle | StatusJSONElementMultiple;

interface StatusJSON {
  className: StatusClassName,
  byte: number,
  bits: string,
  statuses: StatusJSONElement[]
}

// noinspection JSBitwiseOperatorUsage
export abstract class DeviceStatus {
  byte;
  bits: (0 | 1)[] = [];
  bitsAsc: (0 | 1)[] = [];

  public constructor(byte: number) {
    this.byte = byte;
    for (let j = 7; j >= 0; j--) {
      const bit = byte & (1 << j) ? 1 : 0;
      this.bits.push(bit);
    }

    this.bitsAsc = this.bits.slice();
    this.bitsAsc.reverse();
  }

  private getBits() {
    return this.bits.join('');
  }

  protected toJSON(name: StatusClassName): StatusJSON {
    return {
      className: name,
      byte: this.byte,
      bits: this.getBits(),
      statuses: []
    };
  }
}

export class PrinterStatus extends DeviceStatus {
  static commands() {
    return [_.DLE, _.EOT, String.fromCharCode(1)];
  }

  toJSON() {
    let result = super.toJSON('PrinterStatus');
    for (let i = 0; i < 8; i++) {
      let label = '';
      let status = Status.Ok;
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
            status = Status.Error
            label = 'Offline';
          } else {
            label = 'Online';
          }
          break;
        case 5:
          if (this.bitsAsc[i] === 1) {
            status = Status.Error;
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

export class OfflineCauseStatus extends DeviceStatus {
  static commands() {
    return [_.DLE, _.EOT, String.fromCharCode(2)];
  }

  toJSON() {
    let result = super.toJSON('OfflineCauseStatus');
    for (let i = 0; i < 8; i++) {
      let label = '';
      let status = Status.Error;
      switch (i) {
        case 2:
          if (this.bitsAsc[i] === 1) {
            status = Status.Error;
            label = 'Cover is open';
          } else {
            label = 'Cover is closed';
          }
          break;
        case 3:
          if (this.bitsAsc[i] === 1) {
            status = Status.Error;
            label = 'Paper is being fed by the paper feed button';
          } else {
            label = 'Paper is not being fed by the paper feed button';
          }
          break;
        case 5:
          if (this.bitsAsc[i] === 1) {
            status = Status.Error;
            label = 'Printing stops due to a paper-end';
          } else {
            label = 'No paper-end stop';
          }
          break;
        case 6:
          if (this.bitsAsc[i] === 1) {
            status = Status.Error;
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
        label,
        status,
      });
    }

    return result;
  }
}

export class ErrorCauseStatus extends DeviceStatus {
  static commands() {
    return [_.DLE, _.EOT, String.fromCharCode(3)];
  }

  toJSON() {
    let result = super.toJSON('ErrorCauseStatus');
    for (let i = 0; i < 8; i++) {
      let label = '';
      let status = Status.Ok;
      switch (i) {
        case 2:
          if (this.bitsAsc[i] === 1) {
            status = Status.Error;
            label = 'Recoverable error occurred';
          } else {
            label = 'No recoverable error';
          }
          break;
        case 3:
          if (this.bitsAsc[i] === 1) {
            status = Status.Error;
            label = 'Autocutter error occurred';
          } else {
            label = 'No autocutter error';
          }
          break;
        case 5:
          if (this.bitsAsc[i] === 1) {
            status = Status.Error;
            label = 'Unrecoverable error occurred';
          } else {
            label = 'No unrecoverable error';
          }
          break;
        case 6:
          if (this.bitsAsc[i] === 1) {
            status = Status.Error;
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

export class RollPaperSensorStatus extends DeviceStatus {
  static commands() {
    return [_.DLE, _.EOT, String.fromCharCode(4)];
  }

  toJSON() {
    let result = super.toJSON('RollPaperSensorStatus');

    for (let i = 0; i <= 1; i++) {
      result.statuses.push({
        bit: i,
        value: this.bitsAsc[i],
        label: 'Fixed',
        status: Status.Ok
      });
    }

    let label = '';
    let status = Status.Ok;
    if (this.bitsAsc[2] === 1 && this.bitsAsc[3] === 1) {
      status = Status.Warning;
      label = 'Roll paper near-end sensor: paper near-end';
    } else if (this.bitsAsc[2] === 0 && this.bitsAsc[3] === 0) {
      label = 'Roll paper near-end sensor: paper adequate';
    }

    result.statuses.push({
      bit: '2,3',
      value: `${this.bitsAsc[2]}${this.bitsAsc[3]}`,
      label: label,
      status: status
    });

    result.statuses.push({
      bit: 4,
      value: this.bitsAsc[4],
      label: 'Fixed',
      status: Status.Ok
    });

    label = '';
    status = Status.Ok;
    if (this.bitsAsc[5] === 1 && this.bitsAsc[6] === 1) {
      status = Status.Error;
      label = 'Roll paper end sensor: paper not present';
    } else if (this.bitsAsc[5] === 0 && this.bitsAsc[6] === 0) {
      label = 'Roll paper end sensor: paper present';
    }

    result.statuses.push({
      bit: '5,6',
      value: `${this.bitsAsc[5]}${this.bitsAsc[6]}`,
      label: label,
      status,
    });

    for (let i = 7; i <= 8; i++) {
      result.statuses.push({
        bit: i,
        value: this.bitsAsc[i],
        label: 'Fixed',
        status: Status.Ok
      });
    }

    return result;
  }
}

export const statusClasses = {
  PrinterStatus,
  OfflineCauseStatus,
  ErrorCauseStatus,
  RollPaperSensorStatus,
}

export type StatusClassName = keyof typeof statusClasses;
