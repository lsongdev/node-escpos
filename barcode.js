'use strict';

function getParityBit(code, type) {
  switch(type) {
    case 'EAN13':
    case 'EAN8': {
      var parity = 0, reversedCode = code.split('').reverse().join('');
      for (var counter = 0; counter < reversedCode.length; counter += 1) {
        parity += parseInt(reversedCode.charAt(counter), 10) * Math.pow(3, ((counter + 1) % 2));
      }
      return String((10 - (parity % 10)) % 10);
    }
    default: {
      return '';
    }
  }
}

module.exports = {
  getParityBit,
};
