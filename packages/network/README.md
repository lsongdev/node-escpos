
#### Network(address, port = 9100)
```javascript
const escpos = require('escpos');
escpos.Network = require('escpos-network');

const networkDevice = new escpos.Network('localhost', 3000);
```
The default port number is 9100.
