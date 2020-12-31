/**
 * [getParityBit description]
 * @return {[type]} [description]
 */
exports.getParityBit = function (str) {
  var parity = 0, reversedCode = str.split('').reverse().join('');
  for (var counter = 0; counter < reversedCode.length; counter += 1) {
    parity += parseInt(reversedCode.charAt(counter), 10) * Math.pow(3, ((counter + 1) % 2));
  }
  return String((10 - (parity % 10)) % 10);
};

exports.codeLength = function (str) {
  let buff = Buffer.from((str.length).toString(16), 'hex');
  return buff.toString();
}

function charLength (char) {
  const code = char.charCodeAt(0);
  return code > 0x7f && code <= 0xffff ? 2 : 1; // More than 2bytes count as 2
}

exports.textLength = function (str) {
  return str.split('').reduce((accLen, char) => {
    return accLen + charLength(char);
  }, 0)
}

exports.textSubstring = function (str, start, end) {
  let accLen = 0;
  return str.split('').reduce((accStr, char) => {
    accLen = accLen + charLength(char);
    return accStr + (accLen > start && (!end || accLen <= end) ? char : '');
  }, '')
}
